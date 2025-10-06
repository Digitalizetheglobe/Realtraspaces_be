const express = require('express');
const router = express.Router();
const propertyListingController = require('../controllers/propertyListing.controller');
const { uploadPropertyImages } = require('../middleware/propertyUpload');

// Public routes
router.post('/create', uploadPropertyImages, propertyListingController.createPropertyListing);
router.get('/all', propertyListingController.getAllPropertyListings);

// Admin routes (you can add auth middleware here if needed)
router.delete('/delete-all', propertyListingController.deleteAllPropertyListings);
router.get('/status/:status', propertyListingController.getPropertyListingsByStatus);

// ID-based routes (must come after specific routes to avoid conflicts)
router.get('/:id', propertyListingController.getPropertyListingById);
router.put('/:id', uploadPropertyImages, propertyListingController.updatePropertyListing);
router.post('/:id/upload-images', uploadPropertyImages, propertyListingController.uploadAdditionalImages);
router.delete('/:id', propertyListingController.deletePropertyListing);
router.patch('/:id/status', propertyListingController.updatePropertyListingStatus);

module.exports = router;
