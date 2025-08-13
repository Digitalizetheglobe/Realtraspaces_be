'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('property_listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      property_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      property_type: {
        type: Sequelize.ENUM('Office', 'Retail', 'Coworking', 'Industrial or warehouse', 'Land', 'Others'),
        allowNull: false
      },
      transaction_type: {
        type: Sequelize.ENUM('Lease', 'Sale', 'BOTH', 'Preleased'),
        allowNull: false
      },
      area_carpet: {
        type: Sequelize.STRING,
        allowNull: false
      },
      area_builtup: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rent: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      contact_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'active', 'inactive'),
        allowNull: false,
        defaultValue: 'pending'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('property_listings', ['status']);
    await queryInterface.addIndex('property_listings', ['property_type']);
    await queryInterface.addIndex('property_listings', ['transaction_type']);
    await queryInterface.addIndex('property_listings', ['is_active']);
    await queryInterface.addIndex('property_listings', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('property_listings');
  }
};
