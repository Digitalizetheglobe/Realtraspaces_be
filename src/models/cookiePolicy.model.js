const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CookiePolicy = sequelize.define('CookiePolicy', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null for anonymous users
        references: {
            model: 'users',
            key: 'id'
        }
    },
    sessionId: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for authenticated users
        validate: {
            len: [1, 255]
        }
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 45] // IPv4 or IPv6 address length
        }
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    acceptedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    policyVersion: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '1.0'
    }
}, {
    tableName: 'cookie_policies',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['session_id']
        },
        {
            fields: ['ip_address']
        }
    ]
});

module.exports = CookiePolicy;
