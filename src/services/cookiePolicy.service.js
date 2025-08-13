const CookiePolicy = require('../models/cookiePolicy.model');
const User = require('../models/user.model');

class CookiePolicyService {
    // Accept cookies policy
    async acceptCookies(userId, sessionId, ipAddress, userAgent, policyVersion = '1.0') {
        try {
            // Check if user already has a cookie policy record
            const existingRecord = await CookiePolicy.findOne({
                where: {
                    userId: userId || null,
                    sessionId: sessionId || null
                }
            });

            if (existingRecord) {
                // Update existing record
                await existingRecord.update({
                    accepted: true,
                    acceptedAt: new Date(),
                    policyVersion,
                    ipAddress,
                    userAgent
                });
                return {
                    success: true,
                    data: existingRecord,
                    message: 'Cookie policy acceptance updated successfully'
                };
            } else {
                // Create new record
                const cookiePolicy = await CookiePolicy.create({
                    userId: userId || null,
                    sessionId: sessionId || null,
                    ipAddress,
                    userAgent,
                    accepted: true,
                    acceptedAt: new Date(),
                    policyVersion
                });

                return {
                    success: true,
                    data: cookiePolicy,
                    message: 'Cookie policy accepted successfully'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Check if user has accepted cookies
    async checkAcceptance(userId, sessionId) {
        try {
            const record = await CookiePolicy.findOne({
                where: {
                    userId: userId || null,
                    sessionId: sessionId || null
                }
            });

            return {
                success: true,
                data: {
                    accepted: record ? record.accepted : false,
                    acceptedAt: record ? record.acceptedAt : null,
                    policyVersion: record ? record.policyVersion : null
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get cookie policy statistics (for admin purposes)
    async getStatistics() {
        try {
            const totalAcceptances = await CookiePolicy.count({
                where: { accepted: true }
            });

            const recentAcceptances = await CookiePolicy.count({
                where: {
                    accepted: true,
                    acceptedAt: {
                        [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                }
            });

            const uniqueUsers = await CookiePolicy.count({
                where: { accepted: true },
                distinct: true,
                col: 'userId'
            });

            return {
                success: true,
                data: {
                    totalAcceptances,
                    recentAcceptances,
                    uniqueUsers
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get all cookie policy records (for admin purposes)
    async getAllRecords(limit = 50, offset = 0) {
        try {
            const records = await CookiePolicy.findAll({
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email']
                    }
                ],
                order: [['acceptedAt', 'DESC']],
                limit,
                offset
            });

            const total = await CookiePolicy.count();

            return {
                success: true,
                data: {
                    records,
                    total,
                    limit,
                    offset
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new CookiePolicyService();
