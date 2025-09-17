const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CounterStats = sequelize.define('CounterStats', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  yearsInBusiness: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 8,
    field: 'years_in_business',
    comment: 'Number of years the company has been in business'
  },
  propertiesSold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1250,
    field: 'properties_sold',
    comment: 'Total number of properties sold'
  },
  happyClients: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 500,
    field: 'happy_clients',
    comment: 'Number of satisfied clients'
  },
  awardsWon: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 25,
    field: 'awards_won',
    comment: 'Total awards received'
  },
  demoField1: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 100,
    field: 'demo_field_1',
    comment: 'Demo field 1 for additional statistics'
  },
  demoField1Label: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Demo Metric 1',
    field: 'demo_field_1_label',
    comment: 'Label for demo field 1'
  },
  demoField2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 200,
    field: 'demo_field_2',
    comment: 'Demo field 2 for additional statistics'
  },
  demoField2Label: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Demo Metric 2',
    field: 'demo_field_2_label',
    comment: 'Label for demo field 2'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
    comment: 'Whether these counter stats are currently active'
  }
}, {
  tableName: 'counter_stats',
  timestamps: true,
  indexes: [
    {
      unique: false,
      fields: ['is_active']
    }
  ]
});

module.exports = CounterStats;
