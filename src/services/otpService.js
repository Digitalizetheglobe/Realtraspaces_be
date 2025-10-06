const Otp = require('../models/otp.model');
const emailService = require('./emailService');
const { Op } = require('sequelize');

class OtpService {
    /**
     * Generate a 6-digit OTP
     */
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Send OTP for registration
     */
    async sendRegistrationOtp(userData) {
        try {
            const { fullName, email, location, company, mobileNumber } = userData;
            const otpCode = this.generateOtp();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Create OTP record
            await Otp.create({
                email,
                mobileNumber,
                otpCode,
                otpType: 'registration',
                expiresAt
            });

            // Send OTP email
            const emailResult = await emailService.sendOtpEmail({
                fullName,
                email,
                otpCode,
                type: 'registration'
            });

            return {
                success: true,
                message: 'OTP sent successfully',
                emailSent: emailResult.success
            };
        } catch (error) {
            console.error('Error sending registration OTP:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send OTP for login
     */
    async sendLoginOtp(email) {
        try {
            const otpCode = this.generateOtp();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Create OTP record
            await Otp.create({
                email,
                otpCode,
                otpType: 'login',
                expiresAt
            });

            // Send OTP email
            const emailResult = await emailService.sendOtpEmail({
                email,
                otpCode,
                type: 'login'
            });

            return {
                success: true,
                message: 'OTP sent successfully',
                emailSent: emailResult.success
            };
        } catch (error) {
            console.error('Error sending login OTP:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Verify OTP
     */
    async verifyOtp(email, otpCode, otpType) {
        try {
            const otp = await Otp.findOne({
                where: {
                    email,
                    otpCode,
                    otpType,
                    isUsed: false,
                    expiresAt: {
                        [Op.gt]: new Date()
                    }
                }
            });

            if (!otp) {
                return {
                    success: false,
                    message: 'Invalid or expired OTP'
                };
            }

            // Mark OTP as used
            await otp.update({ isUsed: true });

            return {
                success: true,
                message: 'OTP verified successfully'
            };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Clean up expired OTPs
     */
    async cleanupExpiredOtps() {
        try {
            await Otp.destroy({
                where: {
                    expiresAt: {
                        [Op.lt]: new Date()
                    }
                }
            });
        } catch (error) {
            console.error('Error cleaning up expired OTPs:', error);
        }
    }
}

module.exports = new OtpService();
