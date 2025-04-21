const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');

// Create a new testimonial
router.post('/', testimonialController.createTestimonial);

// Get all testimonials
router.get('/', testimonialController.getAllTestimonials);

// Get a single testimonial by ID
router.get('/:id', testimonialController.getTestimonialById);

// Update a testimonial
router.put('/:id', testimonialController.updateTestimonial);

// Delete a testimonial
router.delete('/:id', testimonialController.deleteTestimonial);

// Toggle testimonial status
router.patch('/:id/toggle-status', testimonialController.toggleTestimonialStatus);

module.exports = router; 