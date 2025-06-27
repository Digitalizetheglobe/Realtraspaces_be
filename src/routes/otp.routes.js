const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp.controller');

// OTP routes
router.post('/verify-token', otpController.verifyOtpToken);

module.exports = router;