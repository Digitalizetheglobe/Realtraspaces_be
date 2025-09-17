const CounterStats = require('../models/counterStats.model');

// Get counter statistics (get the active record or create default if none exists)
exports.getCounterStats = async (req, res) => {
  try {
    let counterStats = await CounterStats.findOne({
      where: { isActive: true },
      order: [['updatedAt', 'DESC']]
    });

    // If no active counter stats exist, create default ones
    if (!counterStats) {
      counterStats = await CounterStats.create({
        yearsInBusiness: 8,
        propertiesSold: 1250,
        happyClients: 500,
        awardsWon: 25,
        demoField1: 100,
        demoField1Label: 'Demo Metric 1',
        demoField2: 200,
        demoField2Label: 'Demo Metric 2',
        isActive: true
      });
    }

    res.status(200).json({
      success: true,
      message: 'Counter statistics retrieved successfully',
      data: counterStats
    });

  } catch (error) {
    console.error('Error fetching counter statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create new counter statistics
exports.createCounterStats = async (req, res) => {
  try {
    const {
      yearsInBusiness,
      propertiesSold,
      happyClients,
      awardsWon,
      demoField1,
      demoField1Label,
      demoField2,
      demoField2Label
    } = req.body;

    // Validate required fields
    if (yearsInBusiness === undefined || propertiesSold === undefined || 
        happyClients === undefined || awardsWon === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: yearsInBusiness, propertiesSold, happyClients, awardsWon'
      });
    }

    // Validate that values are non-negative integers
    const fields = { yearsInBusiness, propertiesSold, happyClients, awardsWon };
    for (const [key, value] of Object.entries(fields)) {
      if (!Number.isInteger(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: `${key} must be a non-negative integer`
        });
      }
    }

    // Deactivate any existing active counter stats
    await CounterStats.update(
      { isActive: false },
      { where: { isActive: true } }
    );

    // Create new counter stats
    const counterStats = await CounterStats.create({
      yearsInBusiness,
      propertiesSold,
      happyClients,
      awardsWon,
      demoField1: demoField1 || null,
      demoField1Label: demoField1Label || null,
      demoField2: demoField2 || null,
      demoField2Label: demoField2Label || null,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Counter statistics created successfully',
      data: counterStats
    });

  } catch (error) {
    console.error('Error creating counter statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update counter statistics
exports.updateCounterStats = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const counterStats = await CounterStats.findOne({
      where: { id, isActive: true }
    });

    if (!counterStats) {
      return res.status(404).json({
        success: false,
        message: 'Counter statistics not found'
      });
    }

    // Validate numeric fields if provided
    const numericFields = ['yearsInBusiness', 'propertiesSold', 'happyClients', 'awardsWon', 'demoField1', 'demoField2'];
    for (const field of numericFields) {
      if (updateData[field] !== undefined) {
        if (!Number.isInteger(updateData[field]) || updateData[field] < 0) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-negative integer`
          });
        }
      }
    }

    await counterStats.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Counter statistics updated successfully',
      data: counterStats
    });

  } catch (error) {
    console.error('Error updating counter statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update active counter statistics (updates the currently active record)
exports.updateActiveCounterStats = async (req, res) => {
  try {
    const updateData = req.body;

    let counterStats = await CounterStats.findOne({
      where: { isActive: true },
      order: [['updatedAt', 'DESC']]
    });

    if (!counterStats) {
      return res.status(404).json({
        success: false,
        message: 'No active counter statistics found. Please create counter statistics first.'
      });
    }

    // Validate numeric fields if provided
    const numericFields = ['yearsInBusiness', 'propertiesSold', 'happyClients', 'awardsWon', 'demoField1', 'demoField2'];
    for (const field of numericFields) {
      if (updateData[field] !== undefined) {
        if (!Number.isInteger(updateData[field]) || updateData[field] < 0) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-negative integer`
          });
        }
      }
    }

    await counterStats.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Active counter statistics updated successfully',
      data: counterStats
    });

  } catch (error) {
    console.error('Error updating active counter statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete counter statistics (soft delete)
exports.deleteCounterStats = async (req, res) => {
  try {
    const { id } = req.params;

    const counterStats = await CounterStats.findOne({
      where: { id, isActive: true }
    });

    if (!counterStats) {
      return res.status(404).json({
        success: false,
        message: 'Counter statistics not found'
      });
    }

    await counterStats.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'Counter statistics deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting counter statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all counter statistics (including inactive ones, for admin use)
exports.getAllCounterStats = async (req, res) => {
  try {
    const { page = 1, limit = 10, includeInactive = false } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = includeInactive === 'true' ? {} : { isActive: true };

    const { count, rows } = await CounterStats.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['updatedAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: 'Counter statistics retrieved successfully',
      data: {
        counterStats: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching all counter statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Reset counter statistics to default values
exports.resetCounterStats = async (req, res) => {
  try {
    const { confirm } = req.query;

    if (confirm !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Please confirm reset by adding ?confirm=true to the URL'
      });
    }

    // Deactivate all existing counter stats
    await CounterStats.update(
      { isActive: false },
      { where: { isActive: true } }
    );

    // Create new default counter stats
    const defaultCounterStats = await CounterStats.create({
      yearsInBusiness: 8,
      propertiesSold: 1250,
      happyClients: 500,
      awardsWon: 25,
      demoField1: 100,
      demoField1Label: 'Demo Metric 1',
      demoField2: 200,
      demoField2Label: 'Demo Metric 2',
      isActive: true
    });

    res.status(200).json({
      success: true,
      message: 'Counter statistics reset to default values successfully',
      data: defaultCounterStats
    });

  } catch (error) {
    console.error('Error resetting counter statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
