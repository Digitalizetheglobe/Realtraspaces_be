const sequelize = require('./src/config/database');
const Developer = require('./src/models/developer.model');
const fs = require('fs');
const path = require('path');

async function checkDevelopers() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Get all developers
    const developers = await Developer.findAll();
    console.log(`Found ${developers.length} developers:`);
    
    developers.forEach((developer, index) => {
      console.log(`\nDeveloper ${index + 1}:`);
      console.log(`  ID: ${developer.id}`);
      console.log(`  Name: ${developer.buildername}`);
      console.log(`  Logo: ${developer.builder_logo}`);
      console.log(`  Images: ${JSON.stringify(developer.images)}`);
      
      // Check if logo file exists
      if (developer.builder_logo) {
        const logoPath = path.join(__dirname, 'public', 'developers', developer.builder_logo);
        const logoExists = fs.existsSync(logoPath);
        console.log(`  Logo file exists: ${logoExists}`);
      }
      
      // Check if image files exist
      if (developer.images && developer.images.length > 0) {
        console.log('  Image files:');
        developer.images.forEach((image, imgIndex) => {
          const imagePath = path.join(__dirname, 'public', 'developers', image);
          const imageExists = fs.existsSync(imagePath);
          console.log(`    ${imgIndex + 1}. ${image} - exists: ${imageExists}`);
        });
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await sequelize.close();
  }
}

checkDevelopers();
