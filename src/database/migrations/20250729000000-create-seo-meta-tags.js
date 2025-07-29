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
      meta_title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      meta_keywords: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      canonical_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
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
