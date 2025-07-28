const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const db = require('../models');
const Admin = db.Admin;

// Function to sign JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

// Create and send token
const createSendToken = (admin, statusCode, res) => {
    const token = signToken(admin.id);
    
    // Create a new object without the password
    const adminData = admin.get({ plain: true });
    delete adminData.password;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            admin: adminData
        }
    });
};

// Register a new admin
exports.register = async (req, res, next) => {
    try {
        const { fullName, mobileNumber, password, role } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({
            where: { mobileNumber }
        });

        if (existingAdmin) {
            return res.status(400).json({
                status: 'error',
                message: 'Admin with this mobile number already exists'
            });
        }

        // Create new admin
        const newAdmin = await Admin.create({
            fullName,
            mobileNumber,
            password,
            role: role || 'admin'
        });

        createSendToken(newAdmin, 201, res);
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Login admin
exports.login = async (req, res, next) => {
    try {
        const { mobileNumber, password } = req.body;

        // 1) Check if mobile number and password exist
        if (!mobileNumber || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide mobile number and password!'
            });
        }

        // 2) Check if admin exists && password is correct
        const admin = await Admin.scope('withPassword').findOne({
            where: { mobileNumber }
        });

        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect mobile number or password'
            });
        }

        // 3) Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // 4) If everything ok, send token to client
        createSendToken(admin, 200, res);
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
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
