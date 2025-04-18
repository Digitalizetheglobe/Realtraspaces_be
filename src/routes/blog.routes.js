const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');

// Blog routes
router.post('/', blogController.create);
router.get('/', blogController.findAll);
router.get('/:id', blogController.findOne);
router.get('/slug/:slug', blogController.findBySlug);
router.put('/:id', blogController.update);
router.delete('/:id', blogController.delete);

// Schema update route
router.put('/schema/update', blogController.updateSchema);

module.exports = router; 
