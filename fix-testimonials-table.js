const sequelize = require('./src/config/database');

async function fixTestimonialsTable() {
  try {
    console.log('Fixing testimonials table structure...');
    
    // Drop the existing testimonials table
    await sequelize.query('DROP TABLE IF EXISTS testimonials');
    console.log('✅ Dropped existing testimonials table');
    
    // Create the table with correct column names
    await sequelize.query(`
      CREATE TABLE testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        testimonial TEXT NOT NULL,
        rating INT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created testimonials table with correct structure');
    
    // Insert a test testimonial
    await sequelize.query(`
      INSERT INTO testimonials (name, testimonial, rating, is_active) 
      VALUES ('Test User', 'This is a test testimonial', 5, true)
    `);
    console.log('✅ Inserted test testimonial');
    
    // Verify the table structure
    const [columns] = await sequelize.query('DESCRIBE testimonials');
    console.log('✅ Table structure:');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type}`);
    });
    
    console.log('✅ Testimonials table fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing testimonials table:', error);
  } finally {
    await sequelize.close();
  }
}

fixTestimonialsTable();
