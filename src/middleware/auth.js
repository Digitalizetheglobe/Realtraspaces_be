const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Admin = require('../models/Admin');

// Middleware to protect routes
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
        const currentAdmin = await Admin.findById(decoded.id);
        if (!currentAdmin) {
            return res.status(401).json({
                status: 'error',
                message: 'The admin belonging to this token no longer exists.'
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
