'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, check if the table exists
    const tableExists = await queryInterface.showAllTables().then(tables => 
      tables.includes('developers')
    );

    if (!tableExists) {
      // If table doesn't exist, create it with the correct schema
      return queryInterface.createTable('developers', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        buildername: {
          type: Sequelize.STRING,
          allowNull: false
        },
        builder_logo: {
          type: Sequelize.STRING,
          allowNull: true
        },
        descriptions: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        project_name: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: []
        },
        status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
      });
    }

    // Table exists, check and add/update columns
    const columns = await queryInterface.describeTable('developers');
    
    // Add or modify columns as needed
    const promises = [];
    
    if (!columns.builder_logo) {
      promises.push(
        queryInterface.addColumn('developers', 'builder_logo', {
          type: Sequelize.STRING,
          allowNull: true
        })
      );
    }
    
    if (!columns.project_name) {
      promises.push(
        queryInterface.addColumn('developers', 'project_name', {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: []
        })
      );
    }
    
    if (!columns.status) {
      promises.push(
        queryInterface.addColumn('developers', 'status', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        })
      );
    }
    
    // Rename any old columns if they exist
    if (columns.builderLogo && !columns.builder_logo) {
      promises.push(
        queryInterface.renameColumn('developers', 'builderLogo', 'builder_logo')
      );
    }
    
    if (columns.projectName && !columns.project_name) {
      promises.push(
        queryInterface.renameColumn('developers', 'projectName', 'project_name')
      );
    }
    
    return Promise.all(promises);
  },

  down: async (queryInterface, Sequelize) => {
    // This is a one-way migration, but we'll provide a basic down
    return Promise.resolve();
  }
};
