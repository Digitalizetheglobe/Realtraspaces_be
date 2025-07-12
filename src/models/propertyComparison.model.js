const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const WebUser = require('./webuser.model');

const PropertyComparison = sequelize.define('PropertyComparison', {
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
    addedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'property_comparisons',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['webUserId', 'propertyId'],
            name: 'unique_webuser_property'
        }
    ]
});

// Define association
WebUser.hasMany(PropertyComparison, { 
    foreignKey: 'webUserId',
    as: 'propertyComparisons' 
});

PropertyComparison.belongsTo(WebUser, { 
    foreignKey: 'webUserId',
    as: 'user'
});

module.exports = PropertyComparison;
