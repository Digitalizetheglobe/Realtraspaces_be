const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developer.controller');
const { uploadSingle, uploadMultiple } = require('../middleware/developerUpload');

// Create a new developer
router.post('/', uploadSingle.single('builder_logo'), developerController.createDeveloper);

// Upload multiple images for a developer
router.post('/:id/images', uploadMultiple.array('images', 10), developerController.uploadImages);

// Get all developers
router.get('/', developerController.getAllDevelopers);

// Get single developer by ID
router.get('/:id', developerController.getDeveloperById);

// Update developer
router.put('/:id', uploadSingle.single('builder_logo'), developerController.updateDeveloper);

// Delete developer
router.delete('/:id', developerController.deleteDeveloper);

// Delete specific image from developer
router.delete('/:id/images/:imageIndex', developerController.deleteImage);

module.exports = router;
