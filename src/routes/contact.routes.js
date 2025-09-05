const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// Public route - Submit contact form
router.post('/submit', contactController.submitContact);

// Admin routes - Manage contacts
router.get('/', contactController.getAllContacts);
router.get('/stats', contactController.getContactStats);
router.get('/:id', contactController.getContactById);
router.put('/:id/status', contactController.updateContactStatus);
router.delete('/:id', contactController.deleteContact);

// Bulk operations
router.put('/bulk/status', contactController.bulkUpdateStatus);

module.exports = router;
