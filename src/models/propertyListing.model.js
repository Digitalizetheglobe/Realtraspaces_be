const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PropertyListing = sequelize.define('PropertyListing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  propertyName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'property_name'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  propertyType: {
    type: DataTypes.ENUM('Office', 'Retail', 'Coworking', 'Industrial or warehouse', 'Land', 'Others'),
    allowNull: false,
    field: 'property_type'
  },
  transactionType: {
    type: DataTypes.ENUM('Lease', 'Sale', 'BOTH', 'Preleased'),
    allowNull: false,
    field: 'transaction_type'
  },
  areaCarpet: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'area_carpet'
  },
  areaBuiltup: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'area_builtup'
  },
  rent: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  contactName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contact_name'
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contact_number'
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'email_address',
    validate: {
      isEmail: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of image filenames stored locally'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'active', 'inactive'),
    allowNull: false,
    defaultValue: 'pending'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'property_listings',
  timestamps: true
});

module.exports = PropertyListing;
