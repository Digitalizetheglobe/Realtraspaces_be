const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const webuserController = require('../controllers/webuser.controller');

// Public routes
router.post('/register', webuserController.register);
router.post('/login', webuserController.login);

// Protected routes
router.get('/profile', protect, webuserController.getUserProfile);

module.exports = router;
