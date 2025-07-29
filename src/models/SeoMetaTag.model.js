'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeoMetaTag = sequelize.define('SeoMetaTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Page identifier cannot be empty'
      },
      notNull: {
        msg: 'Page identifier is required'
      }
    }
  },
  metaTitle: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'meta_title'
  },
  metaDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'meta_description'
  },
  metaKeywords: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'meta_keywords'
  },
  canonicalUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'canonical_url',
    validate: {
      isUrl: {
        msg: 'Must be a valid URL'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'seo_meta_tags',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['page']
    }
  ]
});

// Add hooks for data validation if needed
SeoMetaTag.beforeValidate((seoMetaTag) => {
  // Trim string fields
  if (seoMetaTag.metaTitle) seoMetaTag.metaTitle = seoMetaTag.metaTitle.trim();
  if (seoMetaTag.metaDescription) seoMetaTag.metaDescription = seoMetaTag.metaDescription.trim();
  if (seoMetaTag.metaKeywords) seoMetaTag.metaKeywords = seoMetaTag.metaKeywords.trim();
  if (seoMetaTag.canonicalUrl) seoMetaTag.canonicalUrl = seoMetaTag.canonicalUrl.trim();
});

module.exports = SeoMetaTag;
