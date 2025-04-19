const jobApplicationService = require('../services/jobApplication.service');

exports.create = async (req, res) => {
    const result = await jobApplicationService.createApplication(req.body);
    if (result.success) {
        res.status(201).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(400).json({
            status: 'error',
            message: result.error
        });
    }
};

exports.findAll = async (req, res) => {
    const result = await jobApplicationService.getAllApplications();
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
};

exports.findByJobId = async (req, res) => {
    const result = await jobApplicationService.getApplicationsByJobId(req.params.jobId);
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
};

exports.findOne = async (req, res) => {
    const result = await jobApplicationService.getApplicationById(req.params.id);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(result.error === 'Application not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
};

exports.updateStatus = async (req, res) => {
    const result = await jobApplicationService.updateApplicationStatus(
        req.params.id,
        req.body.status
    );
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(result.error === 'Application not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
}; 