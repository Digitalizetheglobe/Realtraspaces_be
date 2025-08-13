const express = require('express');
const router = express.Router();
const propertyListingController = require('../controllers/propertyListing.controller');

// Public routes
router.post('/create', propertyListingController.createPropertyListing);
router.get('/all', propertyListingController.getAllPropertyListings);

// Admin routes (you can add auth middleware here if needed)
router.delete('/delete-all', propertyListingController.deleteAllPropertyListings);
router.get('/status/:status', propertyListingController.getPropertyListingsByStatus);

// ID-based routes (must come after specific routes to avoid conflicts)
router.get('/:id', propertyListingController.getPropertyListingById);
router.put('/:id', propertyListingController.updatePropertyListing);
router.delete('/:id', propertyListingController.deletePropertyListing);
router.patch('/:id/status', propertyListingController.updatePropertyListingStatus);

module.exports = router;
