'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('jobs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      job_title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      job_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      job_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      experience_level: {
        type: Sequelize.STRING,
        allowNull: true
      },
      salary_range: {
        type: Sequelize.STRING,
        allowNull: true
      },
      posted_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
      application_deadline: {
        type: Sequelize.DATE,
        allowNull: true
      },
      job_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      requirements: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      benefits: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      additional_doc_files: {
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
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('jobs');
  }
}; 