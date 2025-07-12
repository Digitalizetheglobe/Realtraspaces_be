const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const WebUser = require('./webuser.model');

const PropertyComparison = sequelize.define('PropertyComparison', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    webUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'web_user_id', // Explicitly set the database column name
        references: {
            model: WebUser,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    propertyId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'property_id' // Explicitly set the database column name
    },
    propertyData: {
        type: DataTypes.JSON,
        allowNull: false,
        field: 'property_data' // Explicitly set the database column name
    },
    addedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'added_at' // Explicitly set the database column name
    }
}, {
    tableName: 'property_comparisons',
    timestamps: false,
    underscored: true, // This will automatically convert camelCase to snake_case for all fields
    indexes: [
        {
            unique: true,
            fields: ['web_user_id', 'property_id'], // Use the actual column names
            name: 'unique_webuser_property'
        }
    ]
});

// Define association
WebUser.hasMany(PropertyComparison, { 
    foreignKey: 'web_user_id', // Use the actual column name
    as: 'propertyComparisons' 
});

PropertyComparison.belongsTo(WebUser, { 
    foreignKey: 'web_user_id', // Use the actual column name
    as: 'user'
});

module.exports = PropertyComparison;
