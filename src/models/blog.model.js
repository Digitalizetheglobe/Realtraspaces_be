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
        type: DataTypes.TEXT,
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

// Sync this model - force: true will drop the table if it exists and create a new one
// In production, you should set force: false and use migrations instead
Blog.sync({ force: true, alter: false })
    .then(() => {
        console.log('Blog table created successfully');
    })
    .catch(err => {
        console.error('Error creating Blog table:', err);
        process.exit(1); // Exit with error to prevent further execution
    });

module.exports = Blog; 