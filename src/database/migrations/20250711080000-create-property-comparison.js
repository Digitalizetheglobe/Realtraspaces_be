'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableExists = await queryInterface.showAllTables().then(tables => {
      return tables.includes('property_comparisons');
    });

    if (!tableExists) {
      await queryInterface.createTable('property_comparisons', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        webUserId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'webusers',
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
        addedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });

      // Add composite unique constraint
      await queryInterface.addConstraint('property_comparisons', {
        fields: ['webUserId', 'propertyId'],
        type: 'unique',
        name: 'unique_webuser_property'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('property_comparisons');
  }
};
