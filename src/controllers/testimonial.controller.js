const testimonialService = require('../services/testimonial.service');

exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);
    res.status(201).json({
      status: 'success',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialService.getAllTestimonials();
    res.status(200).json({
      status: 'success',
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await testimonialService.getTestimonialById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: testimonial
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await testimonialService.deleteTestimonial(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.toggleTestimonialStatus = async (req, res) => {
  try {
    const testimonial = await testimonialService.toggleTestimonialStatus(req.params.id);
    res.status(200).json({
      status: 'success',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}; 