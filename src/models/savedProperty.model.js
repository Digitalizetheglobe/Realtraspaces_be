const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const WebUser = require('./webuser.model');

const SavedProperty = sequelize.define('SavedProperty', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    webUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: WebUser,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    propertyId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    propertyData: {
        type: DataTypes.JSON,
        allowNull: false
    },
    savedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'saved_properties',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['webUserId', 'propertyId'],
            name: 'unique_webuser_saved_property'
        }
    ]
});

// Define association
WebUser.hasMany(SavedProperty, { 
    foreignKey: 'webUserId',
    as: 'savedProperties'
});

SavedProperty.belongsTo(WebUser, { 
    foreignKey: 'webUserId',
    as: 'user'
});

module.exports = SavedProperty;
