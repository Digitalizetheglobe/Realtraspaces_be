const otpService = require('../services/otp.service');

// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({ status: 'error', message: 'Mobile number is required' });
        }

        const result = await otpService.sendOtp(mobileNumber);

        if (result.success) {
            res.status(200).json({ status: 'success', message: result.message });
        } else {
            res.status(500).json({ status: 'error', message: result.error });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;

        if (!mobileNumber || !otp) {
            return res.status(400).json({ status: 'error', message: 'Mobile number and OTP are required' });
        }

        const result = await otpService.verifyOtp(mobileNumber, otp);

        if (result.success) {
            res.status(200).json({ status: 'success', message: result.message });
        } else {
            res.status(400).json({ status: 'error', message: result.error });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
