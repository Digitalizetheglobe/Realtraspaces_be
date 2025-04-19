const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplication.controller');

// Job Application routes
router.post('/', jobApplicationController.create);
router.get('/', jobApplicationController.findAll);
router.get('/job/:jobId', jobApplicationController.findByJobId);
router.get('/:id', jobApplicationController.findOne);
router.put('/:id/status', jobApplicationController.updateStatus);

module.exports = router; 