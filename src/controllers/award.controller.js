const Award = require('../models/award.model');
const { Op } = require('sequelize');

// Helper function to construct full URL from filename
const constructImageUrl = (req, filename) => {
  if (!filename) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/awardsimages/${filename}`;
};

// Helper function to extract filename from URL
const extractFilenameFromUrl = (url) => {
  if (!url) return null;
  return url.split('/').pop();
};

// Helper function to add URLs to award data for API response
const addUrlsToAward = (req, award) => {
  const awardData = award.toJSON ? award.toJSON() : award;
  
  // Add full URL for award_image
  if (awardData.award_image) {
    awardData.award_image_url = constructImageUrl(req, awardData.award_image);
  }
  
  return awardData;
};

// Create a new award
exports.createAward = async (req, res) => {
  try {
    const { award_title, demo_field } = req.body;

    // Store only filename, not full URL
    let award_image = null;
    if (req.file) {
      award_image = req.file.filename;
    }

    const award = await Award.create({
      award_title,
      award_image,
      demo_field: demo_field || null
    });

    // Add URLs for response
    const awardWithUrls = addUrlsToAward(req, award);

    return res.status(201).json({
      success: true,
      message: 'Award created successfully',
      data: awardWithUrls
    });
  } catch (error) {
    console.error('Error creating award:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating award',
      error: error.message
    });
  }
};

// Get all awards
exports.getAllAwards = async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { award_title: { [Op.like]: `%${search}%` } },
        { demo_field: { [Op.like]: `%${search}%` } }
      ];
    }

    const awards = await Award.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    // Add URLs for each award
    const awardsWithUrls = awards.map(award => addUrlsToAward(req, award));

    return res.status(200).json({
      success: true,
      count: awards.length,
      data: awardsWithUrls
    });
  } catch (error) {
    console.error('Error fetching awards:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching awards',
      error: error.message
    });
  }
};

// Get single award by ID
exports.getAwardById = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    // Add URLs for response
    const awardWithUrls = addUrlsToAward(req, award);

    return res.status(200).json({
      success: true,
      data: awardWithUrls
    });
  } catch (error) {
    console.error('Error fetching award:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching award',
      error: error.message
    });
  }
};

// Update award
exports.updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { award_title, award_image, demo_field, status } = req.body;

    const award = await Award.findByPk(id);
    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    // Handle file upload if a new file was provided
    if (req.file) {
      // Delete old image if it exists
      if (award.award_image) {
        try {
          const fs = require('fs');
          const path = require('path');
          const oldImagePath = path.join(__dirname, '..', '..', 'public', 'awardsimages', award.award_image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      // Store only filename
      award.award_image = req.file.filename;
    } else if (award_image !== undefined) {
      // Handle case where image is being removed or updated
      if (award_image && (award_image.includes('http://') || award_image.includes('https://'))) {
        // Extract filename from URL if provided
        award.award_image = extractFilenameFromUrl(award_image);
      } else {
        award.award_image = award_image || null;
      }
    }

    // Update other fields
    if (award_title !== undefined) award.award_title = award_title;
    if (demo_field !== undefined) award.demo_field = demo_field;
    if (status !== undefined) award.status = status;

    await award.save();

    // Add URLs for response
    const awardWithUrls = addUrlsToAward(req, award);

    return res.status(200).json({
      success: true,
      message: 'Award updated successfully',
      data: awardWithUrls
    });
  } catch (error) {
    console.error('Error updating award:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating award',
      error: error.message
    });
  }
};

// Delete award
exports.deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    // Delete image if it exists
    if (award.award_image) {
      try {
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(__dirname, '..', '..', 'public', 'awardsimages', award.award_image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    await award.destroy();

    return res.status(200).json({
      success: true,
      message: 'Award deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting award:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting award',
      error: error.message
    });
  }
};
