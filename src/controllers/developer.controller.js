const Developer = require('../models/developer.model');
const { Op } = require('sequelize');

// Helper function to construct full URL from filename
const constructImageUrl = (req, filename) => {
  if (!filename) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/developers/${filename}`;
};

// Helper function to extract filename from URL
const extractFilenameFromUrl = (url) => {
  if (!url) return null;
  return url.split('/').pop();
};

// Helper function to add URLs to developer data for API response
const addUrlsToDeveloper = (req, developer) => {
  const developerData = developer.toJSON ? developer.toJSON() : developer;
  
  // Add full URL for builder_logo
  if (developerData.builder_logo) {
    developerData.builder_logo_url = constructImageUrl(req, developerData.builder_logo);
  }
  
  // Add full URLs for images
  if (developerData.images && Array.isArray(developerData.images)) {
    developerData.image_urls = developerData.images.map(filename => constructImageUrl(req, filename));
  }
  
  return developerData;
};

// Create a new developer
exports.createDeveloper = async (req, res) => {
  try {
    const { buildername, descriptions, projectName, project_name } = req.body;

    // Handle project names array from form data
    let projectNames = [];
    if (req.body['projectName[]']) {
      // Handle array format from form data
      if (Array.isArray(req.body['projectName[]'])) {
        projectNames = req.body['projectName[]'];
      } else {
        projectNames = [req.body['projectName[]']];
      }
    } else if (project_name) {
      projectNames = Array.isArray(project_name) ? project_name : [project_name];
    } else if (projectName) {
      projectNames = Array.isArray(projectName) ? projectName : [projectName];
    }

    // Store only filename, not full URL
    let builder_logo = null;
    if (req.file) {
      builder_logo = req.file.filename;
    }

    const developer = await Developer.create({
      buildername,
      builder_logo,
      descriptions: descriptions || null,
      project_name: projectNames,
      images: [] // Initialize empty images array
    });

    // Add URLs for response
    const developerWithUrls = addUrlsToDeveloper(req, developer);

    return res.status(201).json({
      success: true,
      message: 'Developer created successfully',
      data: developerWithUrls
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

    // Add URLs for each developer
    const developersWithUrls = developers.map(developer => addUrlsToDeveloper(req, developer));

    return res.status(200).json({
      success: true,
      count: developers.length,
      data: developersWithUrls
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

    // Add URLs for response
    const developerWithUrls = addUrlsToDeveloper(req, developer);

    return res.status(200).json({
      success: true,
      data: developerWithUrls
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
    const { buildername, builderLogo, builder_logo, descriptions, projectName, project_name, status, images } = req.body;

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
          const oldLogoPath = path.join(__dirname, '..', '..', 'public', 'developers', developer.builder_logo);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        } catch (error) {
          console.error('Error deleting old logo:', error);
        }
      }
      // Store only filename
      developer.builder_logo = req.file.filename;
    } else if (builder_logo !== undefined || builderLogo !== undefined) {
      // Handle case where logo is being removed or updated
      const newLogo = builder_logo || builderLogo;
      if (newLogo && (newLogo.includes('http://') || newLogo.includes('https://'))) {
        // Extract filename from URL if provided
        developer.builder_logo = extractFilenameFromUrl(newLogo);
      } else {
        developer.builder_logo = newLogo || null;
      }
    }

    // Handle project names array from form data
    if (req.body['projectName[]'] !== undefined || project_name !== undefined || projectName !== undefined) {
      let projectNames = [];
      if (req.body['projectName[]']) {
        // Handle array format from form data
        if (Array.isArray(req.body['projectName[]'])) {
          projectNames = req.body['projectName[]'];
        } else {
          projectNames = [req.body['projectName[]']];
        }
      } else if (project_name) {
        projectNames = Array.isArray(project_name) ? project_name : [project_name];
      } else if (projectName) {
        projectNames = Array.isArray(projectName) ? projectName : [projectName];
      }
      developer.project_name = projectNames;
    }

    // Update other fields
    if (buildername !== undefined) developer.buildername = buildername;
    if (descriptions !== undefined) developer.descriptions = descriptions;
    if (images !== undefined) {
      // If images is provided as a string, try to parse it as JSON
      if (typeof images === 'string') {
        try {
          const parsedImages = JSON.parse(images);
          // Convert URLs to filenames if needed
          developer.images = parsedImages.map(img => 
            (img.includes('http://') || img.includes('https://')) ? extractFilenameFromUrl(img) : img
          );
        } catch (error) {
          developer.images = [];
        }
      } else if (Array.isArray(images)) {
        // Convert URLs to filenames if needed
        developer.images = images.map(img => 
          (img.includes('http://') || img.includes('https://')) ? extractFilenameFromUrl(img) : img
        );
      } else {
        developer.images = [];
      }
    }
    if (status !== undefined) developer.status = status;

    await developer.save();

    // Add URLs for response
    const developerWithUrls = addUrlsToDeveloper(req, developer);

    return res.status(200).json({
      success: true,
      message: 'Developer updated successfully',
      data: developerWithUrls
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

    // Delete all associated images from filesystem
    if (developer.images && developer.images.length > 0) {
      const fs = require('fs');
      const path = require('path');
      
      developer.images.forEach(filename => {
        try {
          const imagePath = path.join(__dirname, '..', '..', 'public', 'developers', filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (error) {
          console.error('Error deleting image file:', error);
        }
      });
    }

    // Delete logo if it exists
    if (developer.builder_logo) {
      try {
        const fs = require('fs');
        const path = require('path');
        const logoPath = path.join(__dirname, '..', '..', 'public', 'developers', developer.builder_logo);
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
        }
      } catch (error) {
        console.error('Error deleting logo file:', error);
      }
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

// Upload multiple images for a developer
exports.uploadImages = async (req, res) => {
  try {
    const { id } = req.params;
    const developer = await Developer.findByPk(id);

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Store only filenames
    const uploadedFilenames = req.files.map(file => file.filename);

    // Add new images to existing images array
    const currentImages = developer.images || [];
    const updatedImages = [...currentImages, ...uploadedFilenames];

    developer.images = updatedImages;
    await developer.save();

    // Create URLs for response
    const uploadedUrls = uploadedFilenames.map(filename => constructImageUrl(req, filename));
    const totalImageUrls = updatedImages.map(filename => constructImageUrl(req, filename));

    return res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        uploadedImages: uploadedUrls,
        totalImages: totalImageUrls
      }
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
};

// Delete specific image from developer
exports.deleteImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const developer = await Developer.findByPk(id);

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    const images = developer.images || [];
    const index = parseInt(imageIndex);

    if (index < 0 || index >= images.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image index'
      });
    }

    // Delete the image file from filesystem
    const filename = images[index];
    try {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, '..', '..', 'public', 'developers', filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (error) {
      console.error('Error deleting image file:', error);
    }

    // Remove the image from the array
    images.splice(index, 1);
    developer.images = images;
    await developer.save();

    // Create URLs for remaining images
    const remainingImageUrls = images.map(filename => constructImageUrl(req, filename));

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        remainingImages: remainingImageUrls
      }
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
};
