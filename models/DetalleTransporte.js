// models/DetalleTransporte.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleTransporte = sequelize.define('detalle_transporte', {
  pk_detalle_transporte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_transportista: DataTypes.INTEGER,
  fk_transporte: DataTypes.INTEGER,
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
  tableName: 'detalle_transporte',
  timestamps: false,
  freezeTableName: true
});

module.exports = DetalleTransporte;