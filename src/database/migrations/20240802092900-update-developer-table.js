'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop the existing columns if they exist with old names
    await queryInterface.removeColumn('developers', 'builderLogo');
    await queryInterface.removeColumn('developers', 'projectName');
    
    // Then add the new columns with correct names
    await queryInterface.addColumn('developers', 'builder_logo', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('developers', 'project_name', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    
    await queryInterface.addColumn('developers', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.removeColumn('developers', 'builder_logo');
    await queryInterface.removeColumn('developers', 'project_name');
    await queryInterface.removeColumn('developers', 'status');
    
    // Add back the old columns if needed
    await queryInterface.addColumn('developers', 'builderLogo', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('developers', 'projectName', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
  }
};
