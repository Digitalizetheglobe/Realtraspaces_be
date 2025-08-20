const sequelize = require('./src/config/database');
const Testimonial = require('./src/models/testimonial.model');

async function testTestimonials() {
  try {
    console.log('Testing testimonials functionality...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Check if testimonials table exists
    const [results] = await sequelize.query("SHOW TABLES LIKE 'testimonials'");
    console.log('✅ Testimonials table exists:', results.length > 0);
    
    // Try to find all testimonials
    const testimonials = await Testimonial.findAll();
    console.log(`✅ Found ${testimonials.length} testimonials in database`);
    
    // Try to find active testimonials
    const activeTestimonials = await Testimonial.findAll({
      where: { isActive: true }
    });
    console.log(`✅ Found ${activeTestimonials.length} active testimonials`);
    
    // Create a test testimonial if none exist
    if (testimonials.length === 0) {
      console.log('Creating test testimonial...');
      const testTestimonial = await Testimonial.create({
        name: 'Test User',
        testimonial: 'This is a test testimonial',
        rating: 5,
        isActive: true
      });
      console.log('✅ Test testimonial created:', testTestimonial.toJSON());
    }
    
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Error testing testimonials:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testTestimonials();
