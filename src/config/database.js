const { Sequelize } = require('sequelize');
require('dotenv').config();

// First connect without database name to create it if needed
const sequelizeWithoutDB = new Sequelize('', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log
});

// Create database if it doesn't exist
sequelizeWithoutDB.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
    .then(() => {
        console.log(`Database ${process.env.DB_NAME} created or already exists`);
    })
    .catch(err => {
        console.error('Error creating database:', err);
    });

// Now create the main sequelize instance with the database
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: console.log,
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize; 