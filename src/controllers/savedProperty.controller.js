const { Op } = require('sequelize');
const SavedProperty = require('../models/savedProperty.model');
const WebUser = require('../models/webuser.model');

// Save a property for a user
exports.saveProperty = async (req, res) => {
    try {
        const { propertyId, propertyData } = req.body;
        const userId = req.user.id; // Assuming user is authenticated and user ID is in req.user

        // Check if property is already saved
        const existingSave = await SavedProperty.findOne({
            where: {
                webUserId: userId,
                propertyId: propertyId
            }
        });

        if (existingSave) {
            return res.status(400).json({ 
                success: false, 
                message: 'Property already saved' 
            });
        }

        const savedProperty = await SavedProperty.create({
            webUserId: userId,
            propertyId,
            propertyData
        });

        res.status(201).json({
            success: true,
            data: savedProperty
        });
    } catch (error) {
        console.error('Error saving property:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving property',
            error: error.message
        });
    }
};

// Get all saved properties for a user
exports.getSavedProperties = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: savedProperties } = await SavedProperty.findAndCountAll({
            where: { webUserId: userId },
            order: [['savedAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: savedProperties,
            pagination: {
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching saved properties:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching saved properties',
            error: error.message
        });
    }
};

// Remove a saved property
exports.removeSavedProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user.id;

        const result = await SavedProperty.destroy({
            where: {
                webUserId: userId,
                propertyId: propertyId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Saved property not found'
            });
        }

        res.json({
            success: true,
            message: 'Property removed from saved list'
        });
    } catch (error) {
        console.error('Error removing saved property:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing saved property',
            error: error.message
        });
    }
};

// Check if a property is saved by the user
exports.checkIfPropertySaved = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user.id;

        const savedProperty = await SavedProperty.findOne({
            where: {
                webUserId: userId,
                propertyId: propertyId
            },
            attributes: ['id']
        });

        res.json({
            success: true,
            isSaved: !!savedProperty
        });
    } catch (error) {
        console.error('Error checking saved status:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking saved status',
            error: error.message
        });
    }
};
