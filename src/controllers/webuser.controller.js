const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Webuser = require('../models/webuser.model');
const { Op } = require('sequelize');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new webuser
// @route   POST /api/webusers/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { fullName, mobileNumber, email, location, company, password } = req.body;

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

        // Create user
        const user = await Webuser.create({
            fullName,
            mobileNumber,
            email,
            location,
            company,
            password
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            status: 'success',
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                mobileNumber: user.mobileNumber,
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Auth webuser & get token
// @route   POST /api/webusers/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        if (!mobileNumber || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide mobile number and password'
            });
        }

        // Check for user with password
        const user = await Webuser.scope('withPassword').findOne({
            where: { mobile_number: mobileNumber }
        });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user.id);

        // Remove password from response
        const userData = user.get({ plain: true });
        delete userData.password;

        res.json({
            status: 'success',
            data: {
                ...userData,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error during login',
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
