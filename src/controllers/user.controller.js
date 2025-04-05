const userService = require('../services/user.service');

// Create a new user
exports.create = async (req, res) => {
    const result = await userService.createUser(req.body);
    if (result.success) {
        res.status(201).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(400).json({
            status: 'error',
            message: result.error
        });
    }
};

// Get all users
exports.findAll = async (req, res) => {
    const result = await userService.getAllUsers();
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: result.error
        });
    }
};

// Get a single user
exports.findOne = async (req, res) => {
    const result = await userService.getUserById(req.params.id);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(result.error === 'User not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
};

// Update a user
exports.update = async (req, res) => {
    const result = await userService.updateUser(req.params.id, req.body);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(result.error === 'User not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
};

// Delete a user
exports.delete = async (req, res) => {
    const result = await userService.deleteUser(req.params.id);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } else {
        res.status(result.error === 'User not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
}; 