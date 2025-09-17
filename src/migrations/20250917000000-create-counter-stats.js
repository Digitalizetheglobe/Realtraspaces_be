'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('counter_stats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      years_in_business: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 8,
        comment: 'Number of years the company has been in business'
      },
      properties_sold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1250,
        comment: 'Total number of properties sold'
      },
      happy_clients: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 500,
        comment: 'Number of satisfied clients'
      },
      awards_won: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 25,
        comment: 'Total awards received'
      },
      demo_field_1: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 100,
        comment: 'Demo field 1 for additional statistics'
      },
      demo_field_1_label: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Demo Metric 1',
        comment: 'Label for demo field 1'
      },
      demo_field_2: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 200,
        comment: 'Demo field 2 for additional statistics'
      },
      demo_field_2_label: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Demo Metric 2',
        comment: 'Label for demo field 2'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether these counter stats are currently active'
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

    // Add index on is_active for better query performance
    await queryInterface.addIndex('counter_stats', ['is_active'], {
      name: 'idx_counter_stats_is_active'
    });

    // Insert default counter statistics
    await queryInterface.bulkInsert('counter_stats', [
      {
        years_in_business: 8,
        properties_sold: 1250,
        happy_clients: 500,
        awards_won: 25,
        demo_field_1: 100,
        demo_field_1_label: 'Demo Metric 1',
        demo_field_2: 200,
        demo_field_2_label: 'Demo Metric 2',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('counter_stats');
  }
};
