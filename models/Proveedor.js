// models/Proveedor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Proveedor = sequelize.define('proveedor', {
  pk_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_dato_persona: DataTypes.INTEGER,
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
  tableName: 'proveedor',
  timestamps: false,
  freezeTableName: true
});

module.exports = Proveedor;