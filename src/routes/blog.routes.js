const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');

// Blog routes with file upload middleware
router.post('/', 
    blogController.uploadBlogImages, // Handle file uploads
    blogController.create
);

router.get('/', blogController.findAll);
router.get('/:id', blogController.findOne);
router.get('/slug/:slug', blogController.findBySlug);

// Route to serve blog images
router.get('/image/:filename', blogController.serveImage);

router.put('/:id', 
    blogController.uploadBlogImages, // Handle file uploads
    blogController.update
);

router.delete('/:id', blogController.delete);

// Schema update route
router.put('/schema/update', blogController.updateSchema);

module.exports = router;
