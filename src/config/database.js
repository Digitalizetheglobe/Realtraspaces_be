const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a connection without specifying the database
const connection = new Sequelize('', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Create the database if it doesn't exist
connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
    .then(() => {
        console.log('Database created or already exists');
    })
    .catch(err => {
        console.error('Error creating database:', err);
    });

// Create the main sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
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