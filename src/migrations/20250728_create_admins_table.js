'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Admins table
    await queryInterface.createTable('Admins', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mobileNumber: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
          is: /^[0-9]{10}$/
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [6]
        }
      },
      role: {
        type: Sequelize.ENUM('admin', 'superadmin', 'editor'),
        defaultValue: 'admin',
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true
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

    // Create index on mobileNumber
    await queryInterface.addIndex('Admins', ['mobileNumber'], {
      unique: true,
      name: 'admins_mobileNumber_unique'
    });

    // Create default superadmin
    const hashedPassword = await bcrypt.hash('admin@123', 12);
    await queryInterface.bulkInsert('Admins', [{
      fullName: 'Super Admin',
      mobileNumber: '9999999999',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    console.log('Default superadmin created with mobile: 9999999999 and password: admin@123');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Admins');
  }
};
