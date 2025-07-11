const { Op } = require('sequelize');
const PropertyComparison = require('../models/propertyComparison.model');
const { MAX_COMPARISON_ITEMS } = require('../config/constants');

/**
 * Add a property to the user's comparison list
 */
exports.addToComparison = async (req, res) => {
    try {
        const { propertyId, propertyData } = req.body;
        const userId = req.user.id;

        // Check if property is already in comparison
        const existingItem = await PropertyComparison.findOne({
            where: {
                webUserId: userId,
                propertyId: propertyId
            }
        });

        if (existingItem) {
            return res.status(400).json({ 
                success: false, 
                message: 'Property already in comparison list' 
            });
        }

        // Check max comparison items limit
        const comparisonCount = await PropertyComparison.count({
            where: { webUserId: userId }
        });

        if (comparisonCount >= MAX_COMPARISON_ITEMS) {
            return res.status(400).json({
                success: false,
                message: `Maximum of ${MAX_COMPARISON_ITEMS} properties can be compared at a time`
            });
        }

        const comparisonItem = await PropertyComparison.create({
            webUserId: userId,
            propertyId,
            propertyData
        });

        res.status(201).json({
            success: true,
            data: comparisonItem
        });
    } catch (error) {
        console.error('Error adding to comparison:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding property to comparison',
            error: error.message
        });
    }
};

// Get all properties in comparison list
exports.getComparisonList = async (req, res) => {
    try {
        const userId = req.user.id;

        const comparisonItems = await PropertyComparison.findAll({
            where: { webUserId: userId },
            order: [['addedAt', 'DESC']]
        });

        res.json({
            success: true,
            data: comparisonItems,
            count: comparisonItems.length,
            maxItems: MAX_COMPARISON_ITEMS
        });
    } catch (error) {
        console.error('Error fetching comparison list:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching comparison list',
            error: error.message
        });
    }
};

// Remove a property from comparison list
exports.removeFromComparison = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user.id;

        const result = await PropertyComparison.destroy({
            where: {
                webUserId: userId,
                propertyId: propertyId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                success: false,
                message: 'Property not found in comparison list'
            });
        }

        res.json({
            success: true,
            message: 'Property removed from comparison list'
        });
    } catch (error) {
        console.error('Error removing from comparison:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing property from comparison',
            error: error.message
        });
    }
};

// Clear all properties from comparison list
exports.clearComparison = async (req, res) => {
    try {
        const userId = req.user.id;

        await PropertyComparison.destroy({
            where: { webUserId: userId }
        });

        res.json({
            success: true,
            message: 'Comparison list cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing comparison list:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing comparison list',
            error: error.message
        });
    }
};
