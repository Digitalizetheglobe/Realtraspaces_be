const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developer.controller');
const upload = require('../middleware/upload');

// Create a new developer
router.post('/', upload.single('builder_logo'), developerController.createDeveloper);
// router.post('/', upload.single('builderLogo'), developerController.createDeveloper);
// Get all developers
router.get('/', developerController.getAllDevelopers);

// Get single developer by ID
router.get('/:id', developerController.getDeveloperById);

// Update developer
router.put('/:id', developerController.updateDeveloper);

// Delete developer
router.delete('/:id', developerController.deleteDeveloper);

module.exports = router;
