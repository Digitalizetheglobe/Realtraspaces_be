'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job_applications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      job_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'jobs',
          key: 'job_id'
        }
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      current_company: {
        type: Sequelize.STRING,
        allowNull: true
      },
      linkedin_profile_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      experience_years: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      resume: {
        type: Sequelize.STRING,
        allowNull: true
      },
      additional_documents: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM(
          'under_review',
          'rejected',
          'offered',
          'hired',
          'selected_for_next_round'
        ),
        allowNull: false,
        defaultValue: 'under_review'
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
    await queryInterface.dropTable('job_applications');
  }
}; 