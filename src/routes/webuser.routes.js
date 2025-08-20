const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const webuserController = require('../controllers/webuser.controller');
const savedPropertyController = require('../controllers/savedProperty.controller');
const propertyComparisonController = require('../controllers/propertyComparison.controller');

// Public routes
router.post('/register', webuserController.register);
router.post('/login', webuserController.login);

// Protected routes
router.get('/profile', protect, webuserController.getUserProfile);

// Saved Properties routes
router.post('/save-property', protect, savedPropertyController.saveProperty);
router.get('/saved-properties', protect, savedPropertyController.getSavedProperties);
router.delete('/saved-properties/:propertyId', protect, savedPropertyController.removeSavedProperty);
router.get('/check-saved/:propertyId', protect, savedPropertyController.checkIfPropertySaved);

// Property Comparison routes
router.post('/compare/add', protect, propertyComparisonController.addToComparison);
router.get('/compare/list', protect, propertyComparisonController.getComparisonList);
router.delete('/compare/remove/:propertyId', protect, propertyComparisonController.removeFromComparison);
router.delete('/compare/clear', protect, propertyComparisonController.clearComparison);

// Admin routes
router.get('/', protect, webuserController.getAllWebUsers);
router.patch('/:id/status', protect, webuserController.updateUserStatus);

module.exports = router;
