const User = require('../models/user.model');

class UserService {
    // Create a new user
    async createUser(userData) {
        try {
            const user = await User.create(userData);
            return { success: true, data: user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get all users
    async getAllUsers() {
        try {
            const users = await User.findAll();
            return { success: true, data: users };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get user by ID
    async getUserById(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return { success: false, error: 'User not found' };
            }
            return { success: true, data: user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Update user
    async updateUser(id, userData) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return { success: false, error: 'User not found' };
            }
            await user.update(userData);
            return { success: true, data: user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Delete user
    async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return { success: false, error: 'User not found' };
            }
            await user.destroy();
            return { success: true, message: 'User deleted successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new UserService(); 