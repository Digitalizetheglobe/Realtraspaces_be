const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Webuser = require('../models/webuser.model');
const { Op } = require('sequelize');
const emailService = require('../services/emailService');
const otpService = require('../services/otpService');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Send OTP for registration
// @route   POST /api/webusers/send-registration-otp
// @access  Public
exports.sendRegistrationOtp = async (req, res) => {
    try {
        const { fullName, mobileNumber, email, location, company } = req.body;

        // Check if user already exists
        const userExists = await Webuser.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { mobileNumber }
                ]
            }
        });

        if (userExists) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists with this email or mobile number'
            });
        }

        // Send OTP
        const otpResult = await otpService.sendRegistrationOtp({
            fullName,
            mobileNumber,
            email,
            location,
            company
        });

        if (otpResult.success) {
            res.json({
                status: 'success',
                message: 'OTP sent successfully to your email',
                data: { email }
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Failed to send OTP',
                error: otpResult.error
            });
        }
    } catch (error) {
        console.error('Send registration OTP error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error while sending OTP',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Verify OTP and complete registration
// @route   POST /api/webusers/verify-registration-otp
// @access  Public
exports.verifyRegistrationOtp = async (req, res) => {
    try {
        const { email, otpCode, fullName, mobileNumber, location, company } = req.body;

        // Verify OTP
        const otpResult = await otpService.verifyOtp(email, otpCode, 'registration');
        
        if (!otpResult.success) {
            return res.status(400).json({
                status: 'error',
                message: otpResult.message
            });
        }

        // Create user
        const user = await Webuser.create({
            fullName,
            mobileNumber,
            email,
            location,
            company,
            password: 'otp_authenticated' // Placeholder since we're using OTP
        });

        // Generate token
        const token = generateToken(user.id);

        // Send welcome email to user
        try {
            const emailResult = await emailService.sendWelcomeEmail({
                fullName: user.fullName,
                email: user.email,
                location: user.location,
                company: user.company
            });

            if (emailResult.success) {
                console.log('Welcome email sent successfully to:', user.email);
            } else {
                console.error('Failed to send welcome email:', emailResult.error);
            }
        } catch (emailError) {
            console.error('Email sending error:', emailError);
        }

        // Send admin notification email
        try {
            const adminEmailResult = await emailService.sendAdminNotificationEmail({
                fullName: user.fullName,
                email: user.email,
                location: user.location,
                company: user.company,
                mobileNumber: user.mobileNumber
            });

            if (adminEmailResult.success) {
                console.log('Admin notification email sent successfully');
            } else {
                console.error('Failed to send admin notification email:', adminEmailResult.error);
            }
        } catch (adminEmailError) {
            console.error('Admin email sending error:', adminEmailError);
        }

        res.status(201).json({
            status: 'success',
            message: 'Registration completed successfully',
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                mobileNumber: user.mobileNumber,
                token
            }
        });
    } catch (error) {
        console.error('Verify registration OTP error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during registration verification',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Send OTP for login
// @route   POST /api/webusers/send-login-otp
// @access  Public
exports.sendLoginOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email address'
            });
        }

        // Check if user exists
        const user = await Webuser.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found with this email address'
            });
        }

        // Check if user account is active
        if (!user.isActive) {
            return res.status(401).json({
                status: 'error',
                message: 'Account has been deactivated. Please contact administrator.'
            });
        }

        // Send OTP
        const otpResult = await otpService.sendLoginOtp(email);

        if (otpResult.success) {
            res.json({
                status: 'success',
                message: 'OTP sent successfully to your email',
                data: { email }
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Failed to send OTP',
                error: otpResult.error
            });
        }
    } catch (error) {
        console.error('Send login OTP error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error while sending OTP',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Verify OTP and complete login
// @route   POST /api/webusers/verify-login-otp
// @access  Public
exports.verifyLoginOtp = async (req, res) => {
    try {
        const { email, otpCode } = req.body;

        if (!email || !otpCode) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and OTP code'
            });
        }

        // Verify OTP
        const otpResult = await otpService.verifyOtp(email, otpCode, 'login');
        
        if (!otpResult.success) {
            return res.status(400).json({
                status: 'error',
                message: otpResult.message
            });
        }

        // Get user
        const user = await Webuser.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if user account is active
        if (!user.isActive) {
            return res.status(401).json({
                status: 'error',
                message: 'Account has been deactivated. Please contact administrator.'
            });
        }

        // Generate token
        const token = generateToken(user.id);

        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                mobileNumber: user.mobileNumber,
                token
            }
        });
    } catch (error) {
        console.error('Verify login OTP error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during login verification',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get user profile
// @route   GET /api/webusers/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await Webuser.findByPk(req.user.id);

        if (user) {
            res.json({
                status: 'success',
                data: user
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error while fetching profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get all web users (Admin only)
// @route   GET /api/webusers
// @access  Private/Admin
exports.getAllWebUsers = async (req, res) => {
    try {
        const users = await Webuser.findAll({
            attributes: { exclude: ['password'] }, // Always exclude password
            order: [['created_at', 'DESC']]
        });

        res.json({
            status: 'success',
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error while fetching users',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update user status (Admin only)
// @route   PATCH /api/webusers/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        // Validate input
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                status: 'error',
                message: 'isActive must be a boolean value'
            });
        }

        // Find user by ID
        const user = await Webuser.findByPk(id);
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Update user status
        await user.update({ isActive });

        res.json({
            status: 'success',
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error while updating user status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
