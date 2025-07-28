'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database'); // Your custom Sequelize instance

class Admin extends Model {
  // Method to compare passwords
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Static method to hash password if changed
  static async hashPassword(admin) {
    if (admin.changed('password')) {
      admin.password = await bcrypt.hash(admin.password, 12);
    }
  }
}

Admin.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Full name is required'
      }
    }
  },
  mobileNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: {
      msg: 'Mobile number already in use'
    },
    validate: {
      is: {
        args: /^[0-9]{10}$/,
        msg: 'Please enter a valid 10-digit mobile number'
      },
      notEmpty: {
        msg: 'Mobile number is required'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6],
        msg: 'Password must be at least 6 characters long'
      },
      notEmpty: {
        msg: 'Password is required'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'superadmin', 'editor'),
    defaultValue: 'admin',
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Admin',
  tableName: 'Admins',
  hooks: {
    beforeCreate: Admin.hashPassword,
    beforeUpdate: Admin.hashPassword
  },
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: {}
    }
  }
});

module.exports = Admin;
