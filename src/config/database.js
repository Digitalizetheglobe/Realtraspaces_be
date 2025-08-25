const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'realtraspaces_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Bhavik@020302',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Create database if it doesn't exist
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'realtraspaces_db'}`);
    console.log('Database checked/created successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize; 