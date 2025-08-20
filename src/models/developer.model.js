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
      isFilename(value) {
        if (value === null || value === '') return;
        // This will accept only filenames, not full URLs
        if (typeof value !== 'string') {
          throw new Error('Logo must be a string');
        }
        // Check if it's not a URL (shouldn't contain http:// or https://)
        if (value.includes('http://') || value.includes('https://')) {
          throw new Error('Logo should be a filename, not a URL');
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
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArrayOfFilenames(value) {
        if (value !== null && !Array.isArray(value)) {
          throw new Error('Images must be an array');
        }
        if (Array.isArray(value)) {
          value.forEach(filename => {
            if (typeof filename !== 'string') {
              throw new Error('Each image must be a string filename');
            }
            // Check if it's not a URL
            if (filename.includes('http://') || filename.includes('https://')) {
              throw new Error('Images should be filenames, not URLs');
            }
          });
        }
      }
    }
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
