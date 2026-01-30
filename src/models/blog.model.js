const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    blogTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blogDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    blogContent: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    blogImages: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    writer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bookmarks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // Dynamic fields storage
    dynamicFields: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    },
    // Schema for dynamic fields
    fieldSchema: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    }
}, {
    tableName: 'blogs',
    timestamps: true,
    freezeTableName: true
});

// Note: Using migrations instead of automatic sync to avoid index conflicts
// If you need to sync manually in development, use: Blog.sync({ force: false, alter: false })

module.exports = Blog; 