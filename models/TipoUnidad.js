// models/TipoUnidad.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoUnidad = sequelize.define('tipo_unidad', {
  pk_tipo_unidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'tipo_unidad'  // Mapeo al nombre de columna existente
  },
  nombre_tipo_unidad: {
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
  tableName: 'tipo_unidad',
  timestamps: false,
  freezeTableName: true
});

module.exports = TipoUnidad;