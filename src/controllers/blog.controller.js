const blogService = require('../services/blog.service');

// Create a new blog
exports.create = async (req, res) => {
    const result = await blogService.createBlog(req.body);
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

// Update field schema
exports.updateSchema = async (req, res) => {
    const result = await blogService.updateFieldSchema(req.body);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } else {
        res.status(400).json({
            status: 'error',
            message: result.error
        });
    }
};

// Get all blogs
exports.findAll = async (req, res) => {
    const result = await blogService.getAllBlogs();
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

// Get a single blog
exports.findOne = async (req, res) => {
    const result = await blogService.getBlogById(req.params.id);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(result.error === 'Blog not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
};

// Update a blog
exports.update = async (req, res) => {
    const result = await blogService.updateBlog(req.params.id, req.body);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(result.error === 'Blog not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
};

// Delete a blog
exports.delete = async (req, res) => {
    const result = await blogService.deleteBlog(req.params.id);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } else {
        res.status(result.error === 'Blog not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
};

// Get blog by slug
exports.findBySlug = async (req, res) => {
    const result = await blogService.getBlogBySlug(req.params.slug);
    if (result.success) {
        res.status(200).json({
            status: 'success',
            data: result.data
        });
    } else {
        res.status(result.error === 'Blog not found' ? 404 : 500).json({
            status: 'error',
            message: result.error
        });
    }
}; 