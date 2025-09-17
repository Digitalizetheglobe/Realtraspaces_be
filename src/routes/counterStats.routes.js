const express = require('express');
const router = express.Router();
const counterStatsController = require('../controllers/counterStats.controller');

// Public routes
router.get('/', counterStatsController.getCounterStats);

// Admin routes (you can add auth middleware here if needed)
router.post('/create', counterStatsController.createCounterStats);
router.get('/all', counterStatsController.getAllCounterStats);
router.put('/active', counterStatsController.updateActiveCounterStats);
router.post('/reset', counterStatsController.resetCounterStats);

// ID-based routes (must come after specific routes to avoid conflicts)
router.put('/:id', counterStatsController.updateCounterStats);
router.delete('/:id', counterStatsController.deleteCounterStats);

module.exports = router;
