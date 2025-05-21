const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true,
            len: [2, 50] // Minimum 2 characters, maximum 50
        }
    },
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            is: /^[0-9]{10}$/ // Validates a 10-digit mobile number
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true // Ensures a valid email format
        }
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [2, 100] // Minimum 2 characters, maximum 100
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [2, 100] // Minimum 2 characters, maximum 100
        }
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

module.exports = User;
