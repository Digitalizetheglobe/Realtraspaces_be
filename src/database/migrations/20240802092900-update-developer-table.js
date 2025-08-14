'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get current table structure
    const columns = await queryInterface.describeTable('developers');
    
    // First, drop the existing columns if they exist with old names
    if (columns.builderLogo) {
      await queryInterface.removeColumn('developers', 'builderLogo');
    }
    if (columns.projectName) {
      await queryInterface.removeColumn('developers', 'projectName');
    }
    
    // Then add the new columns with correct names (only if they don't exist)
    if (!columns.builder_logo) {
      await queryInterface.addColumn('developers', 'builder_logo', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    if (!columns.project_name) {
      await queryInterface.addColumn('developers', 'project_name', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      });
    }
    
    if (!columns.status) {
      await queryInterface.addColumn('developers', 'status', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Get current table structure
    const columns = await queryInterface.describeTable('developers');
    
    // Revert the changes if needed
    if (columns.builder_logo) {
      await queryInterface.removeColumn('developers', 'builder_logo');
    }
    if (columns.project_name) {
      await queryInterface.removeColumn('developers', 'project_name');
    }
    if (columns.status) {
      await queryInterface.removeColumn('developers', 'status');
    }
    
    // Add back the old columns if needed
    if (!columns.builderLogo) {
      await queryInterface.addColumn('developers', 'builderLogo', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    if (!columns.projectName) {
      await queryInterface.addColumn('developers', 'projectName', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      });
    }
  }
};
