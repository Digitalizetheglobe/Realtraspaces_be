const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'fullName'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'email'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password'
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'phoneNumber'
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'admin',
        field: 'role'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'createdAt'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updatedAt'
    }
}, {
    tableName: 'admins',
    timestamps: true,
    underscored: false,
    fieldMap: {
        id: 'id',
        fullName: 'fullName',
        email: 'email',
        password: 'password',
        phoneNumber: 'phoneNumber',
        role: 'role',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = Admin;
