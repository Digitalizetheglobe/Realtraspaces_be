const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

// In-memory store for OTPs (use Redis or a database in production)
const otpStore = {};

// MSG91 Configuration
const MSG91_API_KEY = process.env.MSG91_API_KEY || '452411AygIEXOfF6x5682c54b1P1'; // Use environment variable for security
const SENDER_ID = process.env.MSG91_SENDER_ID || 'REATRASPACES'; // Use environment variable for sender ID
const ROUTE = process.env.MSG91_ROUTE || '4'; // Transactional route (ensure it's a string)
const COUNTRY_CODE = process.env.MSG91_COUNTRY_CODE || '91'; // Default country code (e.g., '91' for India)

class OtpService {
    /**
     * Generate and send OTP to the user's mobile number
     * @param {string} mobileNumber - The user's mobile number
     * @returns {Promise<object>} - Success or failure response
     */
    async sendOtp(mobileNumber) {
        try {
            // Validate the mobile number
            if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
                throw new Error('Invalid mobile number');
            }

            // Generate a 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000);

            // Store OTP temporarily (use Redis or DB in production)
            otpStore[mobileNumber] = otp;

            console.log(`Generated OTP for ${mobileNumber}: ${otp}`); // Debugging log

            // Prepare API request
            const response = await axios.get('https://api.msg91.com/api/v5/otp', {
                params: {
                    authkey: MSG91_API_KEY,
                    mobiles: `${COUNTRY_CODE}${mobileNumber}`,
                    otp: otp,
                    sender: SENDER_ID,
                    route: ROUTE,
                    otp_length: 6,
                },
            });

            // Log the MSG91 response for debugging
            console.log('MSG91 Response:', response.data);

            // Check if OTP was sent successfully
            if (response.data.type === 'success') {
                return { success: true, message: 'OTP sent successfully' };
            } else {
                throw new Error(response.data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error.message); // Log error for debugging
            return { success: false, error: error.message || 'An error occurred' };
        }
    }

    /**
     * Verify the OTP entered by the user
     * @param {string} mobileNumber - The user's mobile number
     * @param {string} otp - The OTP entered by the user
     * @returns {Promise<object>} - Success or failure response
     */
    async verifyOtp(mobileNumber, otp) {
        try {
            // Validate inputs
            if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
                throw new Error('Invalid mobile number');
            }
            if (!otp || !/^\d{6}$/.test(otp)) {
                throw new Error('Invalid OTP format');
            }

            // Compare the OTP with the stored value
            if (otpStore[mobileNumber] && otpStore[mobileNumber] === parseInt(otp, 10)) {
                delete otpStore[mobileNumber]; // Remove OTP after successful verification
                console.log(`OTP verified for ${mobileNumber}`); // Debugging log
                return { success: true, message: 'OTP verified successfully' };
            }

            console.warn(`Invalid OTP for ${mobileNumber}`); // Debugging log
            return { success: false, error: 'Invalid or expired OTP' };
        } catch (error) {
            console.error('Error verifying OTP:', error.message); // Log error for debugging
            return { success: false, error: error.message || 'An error occurred' };
        }
    }
}

module.exports = new OtpService();
