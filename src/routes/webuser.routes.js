const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const webuserController = require('../controllers/webuser.controller');
const savedPropertyController = require('../controllers/savedProperty.controller');
const propertyComparisonController = require('../controllers/propertyComparison.controller');

// Public routes - OTP based authentication
router.post('/send-registration-otp', webuserController.sendRegistrationOtp);
router.post('/verify-registration-otp', webuserController.verifyRegistrationOtp);
router.post('/send-login-otp', webuserController.sendLoginOtp);
router.post('/verify-login-otp', webuserController.verifyLoginOtp);
router.post('/login', webuserController.loginUser);

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
router.get('/', webuserController.getAllWebUsers); // Removed protect middleware
router.patch('/:id/status', webuserController.updateUserStatus); // Removed protect middleware for admin access

module.exports = router;
