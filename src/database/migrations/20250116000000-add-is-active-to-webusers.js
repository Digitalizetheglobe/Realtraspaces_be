'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('webusers', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });

    // Update existing records to set isActive based on status
    await queryInterface.sequelize.query(`
      UPDATE webusers 
      SET isActive = CASE 
        WHEN status = 'active' THEN true 
        ELSE false 
      END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('webusers', 'isActive');
  }
};
