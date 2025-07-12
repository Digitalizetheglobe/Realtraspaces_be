'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Blogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      blogTitle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      blogDescription: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      blogContent: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      blogImages: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      writer: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      bookmarks: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      seoTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      seoDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      seoKeywords: {
        type: Sequelize.STRING,
        allowNull: true
      },
      featuredImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add index on slug for faster lookups
    await queryInterface.addIndex('Blogs', ['slug'], {
      unique: true,
      name: 'blogs_slug_index'
    });

    // Add index on category for filtering
    await queryInterface.addIndex('Blogs', ['category']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Blogs');
  }
};
