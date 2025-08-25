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

// Sync this model - force: false for production, alter: true for development
// In production, you should use migrations instead of sync
Blog.sync({ force: false, alter: true })
    .then(() => {
        console.log('Blog table synced successfully');
    })
    .catch(err => {
        console.error('Error syncing Blog table:', err);
        // Don't exit process in production, just log the error
        if (process.env.NODE_ENV === 'development') {
            process.exit(1);
        }
    });

module.exports = Blog; 