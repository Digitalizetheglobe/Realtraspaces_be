const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

// Job routes
router.post('/', jobController.create);
router.get('/', jobController.findAll);
router.get('/:jobId', jobController.findOne);
router.put('/:jobId', jobController.update);
router.delete('/:jobId', jobController.delete);

module.exports = router; 
