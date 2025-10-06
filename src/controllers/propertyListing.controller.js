const PropertyListing = require('../models/propertyListing.model');
const { Op } = require('sequelize');

// Create a new property listing
exports.createPropertyListing = async (req, res) => {
  try {
    const {
      propertyName,
      location,
      propertyType,
      transactionType,
      areaCarpet,
      areaBuiltup,
      rent,
      price,
      contactName,
      contactNumber,
      emailAddress,
      description
    } = req.body;

    // Extract image filenames from uploaded files
    const uploadedImages = req.files ? req.files.map(file => file.filename) : [];

    // Validate required fields
    if (!propertyType || !transactionType || !areaCarpet || !areaBuiltup || !contactName || !contactNumber || !emailAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate transaction type requirements
    if ((transactionType === 'Lease' || transactionType === 'BOTH') && !rent) {
      return res.status(400).json({
        success: false,
        message: 'Rent is required for Lease/BOTH transaction type'
      });
    }

    if ((transactionType === 'Sale' || transactionType === 'Preleased' || transactionType === 'BOTH') && !price) {
      return res.status(400).json({
        success: false,
        message: 'Price is required for Sale/Preleased/BOTH transaction type'
      });
    }

    const propertyListing = await PropertyListing.create({
      propertyName,
      location,
      propertyType,
      transactionType,
      areaCarpet,
      areaBuiltup,
      rent: rent || null,
      price: price || null,
      contactName,
      contactNumber,
      emailAddress,
      description,
      images: uploadedImages
    });

    res.status(201).json({
      success: true,
      message: 'Property listing created successfully',
      data: propertyListing
    });

  } catch (error) {
    console.error('Error creating property listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all property listings with pagination and filters
exports.getAllPropertyListings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      propertyType,
      transactionType,
      location,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };

    // Add filters
    if (status) whereClause.status = status;
    if (propertyType) whereClause.propertyType = propertyType;
    if (transactionType) whereClause.transactionType = transactionType;
    if (location) whereClause.location = { [Op.like]: `%${location}%` };
    if (search) {
      whereClause[Op.or] = [
        { propertyName: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await PropertyListing.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: 'Property listings retrieved successfully',
      data: {
        listings: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching property listings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get a single property listing by ID
exports.getPropertyListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyListing = await PropertyListing.findOne({
      where: { id, isActive: true }
    });

    if (!propertyListing) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property listing retrieved successfully',
      data: propertyListing
    });

  } catch (error) {
    console.error('Error fetching property listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update a property listing
exports.updatePropertyListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Extract image filenames from uploaded files if any
    const uploadedImages = req.files ? req.files.map(file => file.filename) : [];
    
    // If new images were uploaded, add them to the update data
    if (uploadedImages.length > 0) {
      updateData.images = uploadedImages;
    }

    const propertyListing = await PropertyListing.findOne({
      where: { id, isActive: true }
    });

    if (!propertyListing) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    // Validate email if provided
    if (updateData.emailAddress) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.emailAddress)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
    }

    await propertyListing.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Property listing updated successfully',
      data: propertyListing
    });

  } catch (error) {
    console.error('Error updating property listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete a property listing (soft delete)
exports.deletePropertyListing = async (req, res) => {
  try {
    const { id } = req.params;

    const propertyListing = await PropertyListing.findOne({
      where: { id, isActive: true }
    });

    if (!propertyListing) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    await propertyListing.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting property listing:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete all property listings (soft delete)
exports.deleteAllPropertyListings = async (req, res) => {
  try {
    const { confirm } = req.query;

    if (confirm !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Please confirm deletion by adding ?confirm=true to the URL'
      });
    }

    const result = await PropertyListing.update(
      { isActive: false },
      { where: { isActive: true } }
    );

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result[0]} property listings`
    });

  } catch (error) {
    console.error('Error deleting all property listings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get property listings by status (for admin)
exports.getPropertyListingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await PropertyListing.findAndCountAll({
      where: { status, isActive: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: `Property listings with status '${status}' retrieved successfully`,
      data: {
        listings: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching property listings by status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update property listing status (for admin)
exports.updatePropertyListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'active', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, active, inactive'
      });
    }

    const propertyListing = await PropertyListing.findOne({
      where: { id, isActive: true }
    });

    if (!propertyListing) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    await propertyListing.update({ status });

    res.status(200).json({
      success: true,
      message: 'Property listing status updated successfully',
      data: propertyListing
    });

  } catch (error) {
    console.error('Error updating property listing status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Upload additional images to an existing property listing
exports.uploadAdditionalImages = async (req, res) => {
  try {
    const { id } = req.params;
    const uploadedImages = req.files ? req.files.map(file => file.filename) : [];

    if (uploadedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const propertyListing = await PropertyListing.findOne({
      where: { id, isActive: true }
    });

    if (!propertyListing) {
      return res.status(404).json({
        success: false,
        message: 'Property listing not found'
      });
    }

    // Get current images and add new ones
    const currentImages = propertyListing.images || [];
    const updatedImages = [...currentImages, ...uploadedImages];

    await propertyListing.update({ images: updatedImages });

    res.status(200).json({
      success: true,
      message: 'Additional images uploaded successfully',
      data: {
        propertyId: id,
        uploadedImages,
        totalImages: updatedImages.length
      }
    });

  } catch (error) {
    console.error('Error uploading additional images:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
