const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Admin = require('../models/Admin.model');
const otpEmailService = require('../services/otpService');

// Configure JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '90d';

/**
 * Sign JWT token
 * @param {number|string} id - Admin ID
 * @returns {string} JWT token
 */
const signToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

/**
 * Create and send token with admin data
 * @param {Object} admin - Admin instance
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendToken = (admin, statusCode, res) => {
    try {
        const token = signToken(admin.id);
        
        // Create a new object without the password
        const adminData = admin.get({ plain: true });
        
        // Remove password from the response
        delete adminData.password;

        res.status(statusCode).json({
            success: true,
            token,
            data: {
                admin: adminData
            },
            message: 'Operation successful'
        });
    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating authentication token',
            error: error.message
        });
    }
};

/**
 * Register a new admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
    try {
        const { fullName, mobileNumber, password, role } = req.body;

        // Validate required fields
        if (!fullName || !mobileNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Full name, mobile number, and password are required'
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({
            where: { mobileNumber }
        });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin with this mobile number already exists'
            });
        }

        // Create new admin
        const newAdmin = await Admin.create({
            fullName,
            mobileNumber,
            password,
            role: role || 'admin',
            isActive: true
        });

        // Send response with token
        createSendToken(newAdmin, 201, res);
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering admin',
            error: error.message
        });
    }
};

/**
 * Request OTP for admin forgot password
 * OTP will be sent to the default admin email ID
 */
exports.requestPasswordResetOtp = async (req, res) => {
    try {
        // Default email where OTP should be sent (can be overridden via env)
        // This is the admin email that will receive the forgot-password OTP.
        const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_RESET_EMAIL || 'credefinepro@gmail.com';

        // Trigger login-type OTP to the default email
        const result = await otpEmailService.sendLoginOtp(DEFAULT_ADMIN_EMAIL);

        // Even if email sending fails, the OTP record is usually created.
        // For security and better UX, don't reveal detailed errors to the client.
        if (!result.success) {
            console.error('Failed to send password reset OTP email:', result.error);
        }

        return res.status(200).json({
            success: true,
            message: 'If an account exists, an OTP has been generated and sent to the admin email.'
        });
    } catch (error) {
        console.error('Error requesting password reset OTP:', error);
        return res.status(500).json({
            success: false,
            message: 'Error requesting password reset OTP',
            error: error.message
        });
    }
};

/**
 * Verify OTP for admin forgot password (email-based)
 * Body: { otpCode }
 *
 * This is used by the frontend "Verify OTP" step and should NOT require auth.
 */
exports.verifyPasswordResetOtp = async (req, res) => {
    try {
        const { otpCode } = req.body;
        const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_RESET_EMAIL || 'credefinepro@gmail.com';

        if (!otpCode) {
            return res.status(400).json({
                success: false,
                message: 'OTP code is required.'
            });
        }

        const otpVerification = await otpEmailService.verifyOtp(
            DEFAULT_ADMIN_EMAIL,
            otpCode,
            'login'
        );

        if (!otpVerification.success) {
            return res.status(400).json({
                success: false,
                message: otpVerification.message || 'Invalid or expired OTP.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully.'
        });
    } catch (error) {
        console.error('Error verifying password reset OTP:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying OTP',
            error: error.message
        });
    }
};

/**
 * Reset admin password using OTP
 * Frontend body: { email, otpCode, newPassword }
 *
 * NOTE:
 * - Does NOT require authentication
 * - Assumes OTP was already verified via verifyPasswordResetOtp
 * - Resets the password of the first active admin (single-admin setup)
 */
exports.resetPasswordWithOtp = async (req, res) => {
    try {
        const { email, otpCode, newPassword } = req.body;

        // Basic validations
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password is required.'
            });
        }

        // Since Admin does not have an email field and we have a single admin,
        // reset password for the first active admin.
        const admin = await Admin.scope('withPassword').findOne({
            where: {
                isActive: true
            },
            order: [['id', 'ASC']]
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'No active admin found to reset password.'
            });
        }

        // Update password (hook will hash it)
        admin.password = newPassword;
        await admin.save();

        return res.status(200).json({
            success: true,
            message: 'Password has been reset successfully.'
        });
    } catch (error) {
        console.error('Error resetting admin password with OTP:', error);
        return res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
};

/**
 * Login admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        // 1) Check if mobile number and password exist
        if (!mobileNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide mobile number and password!'
            });
        }

        // 2) Check if admin exists and is active
        const admin = await Admin.scope('withPassword').findOne({
            where: { 
                mobileNumber,
                isActive: true
            }
        });

        // 3) Check if admin exists and password is correct
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect mobile number or password'
            });
        }

        // 4) Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // 5) Send token to client
        createSendToken(admin, 200, res);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

// Protect routes middleware
exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and check if it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if admin still exists
        const currentAdmin = await Admin.findByPk(decoded.id);
        if (!currentAdmin) {
            return res.status(401).json({
                status: 'error',
                message: 'The admin belonging to this token no longer exists.'
            });
        }

        // 4) Check if admin is active
        if (!currentAdmin.isActive) {
            return res.status(401).json({
                status: 'error',
                message: 'Your account has been deactivated. Please contact the administrator.'
            });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.admin = currentAdmin;
        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'You are not logged in! Please log in to get access.'
        });
    }
};

// Restrict to roles middleware
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            status: 'success',
            results: admins.length,
            data: {
                admins
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get single admin
exports.getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'No admin found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                admin
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update admin
exports.updateAdmin = async (req, res) => {
    try {
        // 1) Create error if user POSTs password data
        if (req.body.password) {
            return res.status(400).json({
                status: 'error',
                message: 'This route is not for password updates. Please use /updateMyPassword.'
            });
        }

        // 2) Find the admin
        const admin = await Admin.findByPk(req.params.id);
        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'No admin found with that ID'
            });
        }

        // 3) Filter out unwanted fields that are not allowed to be updated
        const allowedUpdates = ['fullName', 'mobileNumber', 'role', 'isActive'];
        const updates = {};
        
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // 4) Update the admin
        await admin.update(updates);
        
        // 5) Get the updated admin without password
        const updatedAdmin = await Admin.findByPk(admin.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            status: 'success',
            data: {
                admin: updatedAdmin
            }
        });
    } catch (error) {
        // Handle unique constraint violation (duplicate mobile number)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                status: 'error',
                message: 'Mobile number is already in use by another admin.'
            });
        }
        
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        // Prevent deleting yourself
        if (req.admin.id.toString() === req.params.id) {
            return res.status(400).json({
                status: 'error',
                message: 'You cannot delete your own account!'
            });
        }

        const admin = await Admin.findByPk(req.params.id);

        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'No admin found with that ID'
            });
        }

        await admin.destroy();

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};
