const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp.controller');

/**
 * @swagger
 * /api/auth/otp-widget-config:
 *   get:
 *     summary: Get MSG91 OTP widget configuration
 *     description: Returns the configuration needed to initialize the MSG91 OTP widget on the client side
 *     parameters:
 *       - in: query
 *         name: mobileNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The mobile number to send OTP to (10 digits)
 *     responses:
 *       200:
 *         description: Successfully returned OTP widget configuration
 *       400:
 *         description: Invalid or missing mobile number
 */
router.get('/otp-widget-config', otpController.getOtpWidgetConfig);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP (server-side fallback)
 *     description: Verify OTP on the server side (use as fallback if client-side verification fails)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobileNumber
 *               - otp
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 description: The mobile number that received the OTP
 *               otp:
 *                 type: string
 *                 description: The OTP to verify
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP or missing parameters
 */
router.post('/verify-otp', otpController.verifyOtp);

module.exports = router;
