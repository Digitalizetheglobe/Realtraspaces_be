const blogService = require('../services/blog.service');
const { uploadBlogImages } = require('../utils/fileUpload');
const fs = require('fs');
const path = require('path');

// Middleware for handling blog image uploads
exports.uploadBlogImages = uploadBlogImages;

// Create a new blog
exports.create = async (req, res) => {
    try {
        // Extract blog data from request body
        const blogData = { ...req.body };
        
        // Convert tags from string to array if it's a string
        if (typeof blogData.tags === 'string') {
            blogData.tags = blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
        
        // If files were uploaded, add their filenames to blogData
        if (req.files && req.files.length > 0) {
            blogData.blogImages = req.files.map(file => file.filename);
        }
        
        const result = await blogService.createBlog(blogData);
        
        if (result.success) {
            res.status(201).json({
                status: 'success',
                data: result.data
            });
        } else {
            // Clean up uploaded files if blog creation fails
            if (blogData.blogImages) {
                await blogService.cleanupImages(blogData.blogImages);
            }
            res.status(400).json({
                status: 'error',
                message: result.error
            });
        }
    } catch (error) {
        // Clean up any uploaded files if an error occurs
        if (req.files && req.files.length > 0) {
            const filenames = req.files.map(file => file.filename);
            await blogService.cleanupImages(filenames);
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to create blog: ' + error.message
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
    try {
        // Extract blog data from request body
        const blogData = { ...req.body };
        
        // Convert tags from string to array if it's a string
        if (typeof blogData.tags === 'string') {
            blogData.tags = blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
        
        // If files were uploaded, add their filenames to blogData
        if (req.files && req.files.length > 0) {
            blogData.blogImages = req.files.map(file => file.filename);
        }
        
        const result = await blogService.updateBlog(req.params.id, blogData);
        
        if (result.success) {
            res.status(200).json({
                status: 'success',
                data: result.data
            });
        } else {
            // Clean up uploaded files if blog update fails
            if (blogData.blogImages) {
                await blogService.cleanupImages(blogData.blogImages);
            }
            res.status(result.error === 'Blog not found' ? 404 : 500).json({
                status: 'error',
                message: result.error
            });
        }
    } catch (error) {
        // Clean up any uploaded files if an error occurs
        if (req.files && req.files.length > 0) {
            const filenames = req.files.map(file => file.filename);
            await blogService.cleanupImages(filenames);
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to update blog: ' + error.message
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

// Serve blog image by filename
exports.serveImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const imagePath = path.join(__dirname, '../../public/blogImages', filename);
        
        // Check if file exists
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({
                status: 'error',
                message: 'Image not found'
            });
        }
        
        // Serve the image file
        res.sendFile(imagePath);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to serve image: ' + error.message
        });
    }
}; 