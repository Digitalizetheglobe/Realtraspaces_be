const jobService = require('../services/job.service');

exports.create = async (req, res) => {
    const result = await jobService.createJob(req.body);
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
    const result = await jobService.getAllJobs();
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
    const result = await jobService.getJobById(req.params.jobId);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(result.error === 'Job not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
};

exports.update = async (req, res) => {
    const result = await jobService.updateJob(req.params.jobId, req.body);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(result.error === 'Job not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
};

exports.delete = async (req, res) => {
    const result = await jobService.deleteJob(req.params.jobId);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } else {
        res.status(result.error === 'Job not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
}; 