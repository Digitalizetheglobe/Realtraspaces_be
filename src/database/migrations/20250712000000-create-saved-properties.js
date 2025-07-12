'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('saved_properties', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      webUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'webusers', // This should be the actual table name in your database
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      propertyId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      propertyData: {
        type: Sequelize.JSON,
        allowNull: false
      },
      savedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add composite unique constraint
    await queryInterface.addConstraint('saved_properties', {
      fields: ['webUserId', 'propertyId'],
      type: 'unique',
      name: 'unique_webuser_saved_property'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('saved_properties');
  }
};
