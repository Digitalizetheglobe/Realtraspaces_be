const jwt = require('jsonwebtoken');
const Webuser = require('../models/webuser.model');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

            // Get user from the token
            req.user = await Webuser.findByPk(decoded.id);

            next();
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({
                status: 'error',
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        res.status(401).json({
            status: 'error',
            message: 'Not authorized, no token'
        });
    }
};
