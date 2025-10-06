const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Otp = sequelize.define('Otp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    mobileNumber: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: 'mobile_number'
    },
    otpCode: {
        type: DataTypes.STRING(6),
        allowNull: false,
        field: 'otp_code'
    },
    otpType: {
        type: DataTypes.ENUM('registration', 'login'),
        allowNull: false,
        field: 'otp_type'
    },
    isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_used'
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
    },
    attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'otps',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Otp;
