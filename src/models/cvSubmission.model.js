'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CVSubmission = sequelize.define('CVSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 20]
    }
  },
  email_id: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cv_file: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isFilename(value) {
        if (value === null || value === '') return;
        // This will accept only filenames, not full URLs
        if (typeof value !== 'string') {
          throw new Error('CV file must be a string');
        }
        // Check if it's not a URL (shouldn't contain http:// or https://)
        if (value.includes('http://') || value.includes('https://')) {
          throw new Error('CV file should be a filename, not a URL');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'contacted', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  submission_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'cv_submissions',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = CVSubmission;
