const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const WebUser = require('./webuser.model');

const SavedProperty = sequelize.define('SavedProperty', {
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
    savedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'savedAt' // Explicitly set to match database column name
    }
}, {
    tableName: 'saved_properties',
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
        savedAt: 'savedAt'
    },
    indexes: [
        {
            unique: true,
            fields: ['webUserId', 'propertyId'],
            name: 'unique_webuser_saved_property'
        }
    ]
});

// Define association with explicit field names
WebUser.hasMany(SavedProperty, { 
    foreignKey: 'webUserId',
    targetKey: 'id',
    as: 'savedProperties'
});

SavedProperty.belongsTo(WebUser, { 
    foreignKey: 'webUserId',
    targetKey: 'id',
    as: 'user'
});

module.exports = SavedProperty;
