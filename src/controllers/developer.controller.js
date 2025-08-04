const Developer = require('../models/developer.model');
const { Op } = require('sequelize');

// Create a new developer
exports.createDeveloper = async (req, res) => {
  try {
    const { buildername, descriptions, projectName, project_name } = req.body;

    // Get uploaded file path
    let builder_logo = null;
    if (req.file) {
      // Create full URL for the uploaded file
      const protocol = req.protocol;
      const host = req.get('host');
      builder_logo = `${protocol}://${host}/developers/${req.file.filename}`;
    }

    const developer = await Developer.create({
      buildername,
      builder_logo,
      descriptions: descriptions || null,
      project_name: project_name || projectName || []
    });

    return res.status(201).json({
      success: true,
      message: 'Developer created successfully',
      data: developer
    });
  } catch (error) {
    console.error('Error creating developer:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating developer',
      error: error.message
    });
  }
};

// Get all developers
exports.getAllDevelopers = async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { buildername: { [Op.like]: `%${search}%` } },
        { descriptions: { [Op.like]: `%${search}%` } }
      ];
    }

    const developers = await Developer.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: developers.length,
      data: developers
    });
  } catch (error) {
    console.error('Error fetching developers:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching developers',
      error: error.message
    });
  }
};

// Get single developer by ID
exports.getDeveloperById = async (req, res) => {
  try {
    const { id } = req.params;
    const developer = await Developer.findByPk(id);

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: developer
    });
  } catch (error) {
    console.error('Error fetching developer:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching developer',
      error: error.message
    });
  }
};

// Update developer
exports.updateDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    const { buildername, builderLogo, builder_logo, descriptions, projectName, project_name, status } = req.body;

    const developer = await Developer.findByPk(id);
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    // Handle file upload if a new file was provided
    if (req.file) {
      // Delete old logo if it exists
      if (developer.builder_logo) {
        try {
          const fs = require('fs');
          const path = require('path');
          // Extract the filename from the URL
          const oldFilename = developer.builder_logo.split('/').pop();
          const oldLogoPath = path.join(__dirname, '..', '..', 'public', 'developers', oldFilename);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        } catch (error) {
          console.error('Error deleting old logo:', error);
        }
      }
      // Create full URL for the new file
      const protocol = req.protocol;
      const host = req.get('host');
      developer.builder_logo = `${protocol}://${host}/developers/${req.file.filename}`;
    } else if (builder_logo !== undefined || builderLogo !== undefined) {
      // Handle case where logo is being removed
      developer.builder_logo = builder_logo || builderLogo || null;
    }

    // Update other fields
    if (buildername !== undefined) developer.buildername = buildername;
    if (descriptions !== undefined) developer.descriptions = descriptions;
    if (project_name !== undefined || projectName !== undefined) {
      developer.project_name = project_name || projectName || [];
    }
    if (status !== undefined) developer.status = status;

    await developer.save();

    return res.status(200).json({
      success: true,
      message: 'Developer updated successfully',
      data: developer
    });
  } catch (error) {
    console.error('Error updating developer:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating developer',
      error: error.message
    });
  }
};

// Delete developer
exports.deleteDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    const developer = await Developer.findByPk(id);

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    await developer.destroy();

    return res.status(200).json({
      success: true,
      message: 'Developer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting developer:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting developer',
      error: error.message
    });
  }
};
