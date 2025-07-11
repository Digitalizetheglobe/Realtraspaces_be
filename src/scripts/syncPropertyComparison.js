const { Sequelize } = require('sequelize');
const config = require('../config/config');
const PropertyComparison = require('../models/propertyComparison.model');

// Get the database configuration based on environment
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create a new Sequelize instance
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'mysql',
        logging: console.log
    }
);

// Update the PropertyComparison model with the new sequelize instance
PropertyComparison.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    webUserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    propertyId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    propertyData: {
        type: Sequelize.JSON,
        allowNull: false
    },
    addedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize,
    modelName: 'PropertyComparison',
    tableName: 'property_comparisons',
    timestamps: false
});

async function syncModel() {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync the model with force: true to drop and recreate the table
        await PropertyComparison.sync({ force: true });
        console.log('PropertyComparison table has been created successfully.');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating PropertyComparison table:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

syncModel();
