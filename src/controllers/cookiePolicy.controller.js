const cookiePolicyService = require('../services/cookiePolicy.service');

// Accept cookies policy
exports.acceptCookies = async (req, res) => {
    try {
        const { userId, sessionId, policyVersion } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];

        // Validate required fields
        if (!ipAddress) {
            return res.status(400).json({
                status: 'error',
                message: 'IP address is required'
            });
        }

        const result = await cookiePolicyService.acceptCookies(
            userId,
            sessionId,
            ipAddress,
            userAgent,
            policyVersion
        );

        if (result.success) {
            res.status(200).json({
                status: 'success',
                message: result.message,
                data: {
                    accepted: true,
                    acceptedAt: result.data.acceptedAt,
                    policyVersion: result.data.policyVersion
                }
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Check cookie policy acceptance status
exports.checkAcceptance = async (req, res) => {
    try {
        const { userId, sessionId } = req.query;

        const result = await cookiePolicyService.checkAcceptance(userId, sessionId);

        if (result.success) {
            res.status(200).json({
                status: 'success',
                data: result.data
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get cookie policy statistics (admin only)
exports.getStatistics = async (req, res) => {
    try {
        const result = await cookiePolicyService.getStatistics();

        if (result.success) {
            res.status(200).json({
                status: 'success',
                data: result.data
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get all cookie policy records (admin only)
exports.getAllRecords = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const result = await cookiePolicyService.getAllRecords(
            parseInt(limit),
            parseInt(offset)
        );

        if (result.success) {
            res.status(200).json({
                status: 'success',
                data: result.data
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
