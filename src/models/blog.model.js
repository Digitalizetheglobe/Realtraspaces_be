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
    blogImage: {
        type: DataTypes.STRING,
        allowNull: true
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

// Sync this model
Blog.sync({ force: true })
    .then(() => {
        console.log('Blog table created successfully');
    })
    .catch(err => {
        console.error('Error creating Blog table:', err);
    });

module.exports = Blog; 