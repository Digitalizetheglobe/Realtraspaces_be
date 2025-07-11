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
        }
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
            fields: ['webUserId', 'propertyId']
        }
    ]
});

// Define association
WebUser.hasMany(SavedProperty, { foreignKey: 'webUserId' });
SavedProperty.belongsTo(WebUser, { foreignKey: 'webUserId' });

module.exports = SavedProperty;
