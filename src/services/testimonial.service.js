const Testimonial = require('../models/testimonial.model');

class TestimonialService {
  async createTestimonial(data) {
    try {
      const testimonial = await Testimonial.create(data);
      return testimonial;
    } catch (error) {
      throw new Error(`Error creating testimonial: ${error.message}`);
    }
  }

  async getAllTestimonials() {
    try {
      console.log('Fetching all testimonials...');
      const testimonials = await Testimonial.findAll({
        where: { isActive: true }
      });
      console.log(`Found ${testimonials.length} testimonials`);
      return testimonials;
    } catch (error) {
      console.error('Error in getAllTestimonials:', error);
      throw new Error(`Error fetching testimonials: ${error.message}`);
    }
  }

  async getTestimonialById(id) {
    try {
      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        throw new Error('Testimonial not found');
      }
      return testimonial;
    } catch (error) {
      throw new Error(`Error fetching testimonial: ${error.message}`);
    }
  }

  async updateTestimonial(id, data) {
    try {
      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        throw new Error('Testimonial not found');
      }
      await testimonial.update(data);
      return testimonial;
    } catch (error) {
      throw new Error(`Error updating testimonial: ${error.message}`);
    }
  }

  async deleteTestimonial(id) {
    try {
      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        throw new Error('Testimonial not found');
      }
      await testimonial.destroy();
      return { message: 'Testimonial deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting testimonial: ${error.message}`);
    }
  }

  async toggleTestimonialStatus(id) {
    try {
      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        throw new Error('Testimonial not found');
      }
      await testimonial.update({ isActive: !testimonial.isActive });
      return testimonial;
    } catch (error) {
      throw new Error(`Error toggling testimonial status: ${error.message}`);
    }
  }
}

module.exports = new TestimonialService(); 