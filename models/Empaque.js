// models/Empaque.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empaque = sequelize.define('empaque', {
  pk_empaque: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_empaque: DataTypes.STRING(150),
  hora: {
    type: DataTypes.TIME,
    defaultValue: DataTypes.NOW
  },
  fecha: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'empaque',
  timestamps: false,
  freezeTableName: true
});

module.exports = Empaque;