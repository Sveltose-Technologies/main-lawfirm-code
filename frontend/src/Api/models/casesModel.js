const { DataTypes } = require('sequelize');
const sequelize = require('../configer/dbconfig'); // make sure this exports your Sequelize instance

const Case = sequelize.define('Case', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  case_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true
  },
  hearing_datetime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'low'
  },
  contact_person: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  contact_person_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  people_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Running', 'Completed'),
    defaultValue: 'Pending'
  }
}, {
  tableName: 'cases',
  timestamps: true,
  
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Case;
