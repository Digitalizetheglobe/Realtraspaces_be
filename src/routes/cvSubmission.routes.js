const express = require('express');
const router = express.Router();
const cvSubmissionController = require('../controllers/cvSubmission.controller');
const { uploadSingle } = require('../middleware/cvUpload');

// Public route - Submit CV
router.post('/submit', uploadSingle.single('cv_file'), cvSubmissionController.submitCV);

// Admin routes - Manage CV submissions
router.get('/', cvSubmissionController.getAllSubmissions);
router.get('/stats', cvSubmissionController.getSubmissionStats);
router.get('/:id', cvSubmissionController.getSubmissionById);
router.put('/:id/status', cvSubmissionController.updateSubmissionStatus);
router.delete('/:id', cvSubmissionController.deleteSubmission);

// Download CV file
router.get('/download/:filename', cvSubmissionController.downloadCV);

module.exports = router;
