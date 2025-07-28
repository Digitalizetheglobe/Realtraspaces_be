const sequelize = require('./src/config/database');
const Admin = require('./src/models/Admin.model');

async function testConnection() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Test Admin model
    const admin = await Admin.findOne();
    console.log('Admin model test:', admin ? 'Admin found' : 'No admin found');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await sequelize.close();
  }
}

testConnection();
