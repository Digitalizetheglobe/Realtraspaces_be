const otpService = require('../services/otp.service');

/**
 * Get OTP widget configuration
 * This endpoint returns the configuration needed to initialize the MSG91 OTP widget on the client side
 */
exports.getOtpWidgetConfig = async (req, res) => {
    try {
        const { mobileNumber } = req.query;
        
        if (!mobileNumber) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Mobile number is required' 
            });
        }

        const widgetConfig = otpService.getWidgetConfig(mobileNumber);
        res.status(200).json({
            status: 'success',
            data: widgetConfig
        });
    } catch (error) {
        console.error('Error getting OTP widget config:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message || 'Failed to get OTP widget configuration' 
        });
    }
};

/**
 * Verify OTP (server-side verification if needed)
 * This can be used as a fallback if client-side verification fails
 */
exports.verifyOtp = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;
        
        if (!mobileNumber || !otp) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Mobile number and OTP are required' 
            });
        }

        const result = otpService.verifyOtp(mobileNumber, otp);
        
        if (result.success) {
            return res.status(200).json({
                status: 'success',
                message: result.message
            });
        } else {
            return res.status(400).json({
                status: 'error',
                message: result.message
            });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message || 'Failed to verify OTP' 
        });
    }
};

// Verify OTP token
// Add this to your otp.controller.js
exports.verifyOtpToken = async (req, res) => {
    try {
        const { token, mobileNumber } = req.body;

        if (!token || !mobileNumber) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Token and mobile number are required' 
            });
        }

        // Verify the token with MSG91
        const response = await axios.get('https://api.msg91.com/api/v5/otp/verify', {
            params: {
                authkey: process.env.MSG91_API_KEY,
                token: token,
                mobile: mobileNumber
            }
        });

        if (response.data.type === 'success') {
            // Token is valid - create session/JWT and return
            return res.status(200).json({ 
                status: 'success', 
                message: 'OTP verified successfully',
                // Include any user data or tokens here
            });
        } else {
            return res.status(400).json({ 
                status: 'error', 
                message: response.data.message || 'Invalid OTP' 
            });
        }
    } catch (error) {
        console.error('Error verifying OTP token:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: error.response?.data?.message || 'Failed to verify OTP' 
        });
    }
};