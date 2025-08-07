// models/Transporte.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transporte = sequelize.define('transporte', {
  pk_transporte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_placa: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  numero_oficial: DataTypes.STRING(50),
  fk_tipo_vehiculo: DataTypes.INTEGER,
  fk_empresa: DataTypes.INTEGER,
  fk_empaque: DataTypes.INTEGER,
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
  tableName: 'transporte',
  timestamps: false,
  freezeTableName: true
});

module.exports = Transporte;