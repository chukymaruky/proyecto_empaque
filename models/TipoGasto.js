// models/TipoGasto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoGasto = sequelize.define('tipo_gasto', {
  pk_tipo_gasto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_gasto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
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
  tableName: 'tipo_gasto',
  timestamps: false,
  freezeTableName: true
});

module.exports = TipoGasto;