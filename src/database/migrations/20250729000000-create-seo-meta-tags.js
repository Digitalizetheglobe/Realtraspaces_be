'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seo_meta_tags', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      page: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      metaTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      metaDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      metaKeywords: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      canonicalUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add index on page field for faster lookups
    await queryInterface.addIndex('seo_meta_tags', ['page'], {
      unique: true,
      name: 'seo_meta_tags_page_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seo_meta_tags');
  }
};
