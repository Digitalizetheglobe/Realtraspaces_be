const express = require('express');
const router = express.Router();
const cookiePolicyController = require('../controllers/cookiePolicy.controller');

// Public routes
router.post('/accept', cookiePolicyController.acceptCookies);
router.get('/check', cookiePolicyController.checkAcceptance);

// Admin routes (you may want to add authentication middleware here)
router.get('/statistics', cookiePolicyController.getStatistics);
router.get('/records', cookiePolicyController.getAllRecords);

module.exports = router;
