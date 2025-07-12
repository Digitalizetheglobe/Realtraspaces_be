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
        field: 'webUserId', // Explicitly set to match database column name
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
        field: 'propertyId' // Explicitly set to match database column name
    },
    propertyData: {
        type: DataTypes.JSON,
        allowNull: false,
        field: 'propertyData' // Explicitly set to match database column name
    },
    addedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'addedAt' // Explicitly set to match database column name
    }
}, {
    tableName: 'property_comparisons',
    timestamps: false,
    // Disable automatic transformation of field names
    // to prevent any implicit snake_case conversion
    underscored: false,
    // Explicitly define the field mapping
    fieldMap: {
        id: 'id',
        webUserId: 'webUserId',
        propertyId: 'propertyId',
        propertyData: 'propertyData',
        addedAt: 'addedAt'
    },
    indexes: [
        {
            unique: true,
            fields: ['webUserId', 'propertyId'],
            name: 'unique_webuser_property'
        }
    ]
});

// Define association with explicit field names
WebUser.hasMany(PropertyComparison, { 
    foreignKey: 'webUserId',
    targetKey: 'id',
    as: 'propertyComparisons'
});

PropertyComparison.belongsTo(WebUser, { 
    foreignKey: 'webUserId',
    targetKey: 'id',
    as: 'user'
});

module.exports = PropertyComparison;
