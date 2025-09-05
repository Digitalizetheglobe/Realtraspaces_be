'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Award = sequelize.define('Award', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  award_title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  award_image: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isFilename(value) {
        if (value === null || value === '') return;
        // This will accept only filenames, not full URLs
        if (typeof value !== 'string') {
          throw new Error('Award image must be a string');
        }
        // Check if it's not a URL (shouldn't contain http:// or https://)
        if (value.includes('http://') || value.includes('https://')) {
          throw new Error('Award image should be a filename, not a URL');
        }
      }
    }
  },
  demo_field: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'awards',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Award;
