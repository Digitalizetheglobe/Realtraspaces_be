'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Developer = sequelize.define('Developer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  buildername: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  builder_logo: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrlOrPath(value) {
        if (value === null || value === '') return;
        // This will accept both URLs and relative paths
        if (typeof value !== 'string') {
          throw new Error('Logo must be a string');
        }
      }
    }
  },
  descriptions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  project_name: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'developers',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Developer;
