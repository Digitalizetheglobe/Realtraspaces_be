// OTP Service for MSG91 Widget Integration
require('dotenv').config();

// In-memory store for OTP verification (use Redis or a database in production)
const otpStore = {};

// MSG91 Widget Configuration
const MSG91_WIDGET_ID = process.env.MSG91_WIDGET_ID || '356641695a63323636323237';
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY || '452411TebmMnVwy685e7950P1';

class OtpService {
    /**
     * Generate OTP and prepare widget configuration
     * @param {string} mobileNumber - The user's mobile number
     * @returns {object} - Widget configuration and OTP data
     */
    getWidgetConfig(mobileNumber) {
        try {
            // Validate the mobile number
            if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
                throw new Error('Invalid mobile number');
            }

            // Generate a 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            
            // Store OTP temporarily (use Redis or DB in production)
            otpStore[mobileNumber] = otp;
            console.log(`Generated OTP for ${mobileNumber}: ${otp}`);

            // Return widget configuration
            return {
                widgetId: MSG91_WIDGET_ID,
                tokenAuth: MSG91_AUTH_KEY,
                identifier: mobileNumber,
                exposeMethods: true,
                success: (data) => {
                    console.log('OTP verification successful:', data);
                    // Remove OTP after successful verification
                    delete otpStore[mobileNumber];
                },
                failure: (error) => {
                    console.error('OTP verification failed:', error);
                },
                onExpire: () => {
                    console.log('OTP expired');
                    delete otpStore[mobileNumber];
                },
                onClose: () => {
                    console.log('Widget closed');
                }
            };
        } catch (error) {
            console.error('Error in getWidgetConfig:', error);
            throw error;
        }
    }

    /**
     * Verify OTP (server-side verification if needed)
     * @param {string} mobileNumber - The user's mobile number
     * @param {string} otp - The OTP to verify
     * @returns {object} - Verification result
     */
    verifyOtp(mobileNumber, otp) {
        try {
            // Validate inputs
            if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
                return { success: false, message: 'Invalid mobile number' };
            }
            if (!otp || !/^\d{6}$/.test(otp)) {
                return { success: false, message: 'Invalid OTP format' };
            }
            
            const storedOtp = otpStore[mobileNumber];
            if (!storedOtp) {
                return { success: false, message: 'OTP expired or not found' };
            }

            // Compare OTPs
            const isValid = storedOtp.toString() === otp.toString();
            
            // Clear OTP after verification (one-time use)
            if (isValid) {
                delete otpStore[mobileNumber];
                return { success: true, message: 'OTP verified successfully' };
            } else {
                return { success: false, message: 'Invalid OTP' };
            }
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            return { success: false, message: error.message || 'Error verifying OTP' };
        }
    }
}

module.exports = new OtpService();
