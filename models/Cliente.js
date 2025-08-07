// models/Cliente.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define('cliente', {
  pk_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
  tableName: 'cliente',
  timestamps: false,
  freezeTableName: true
});

module.exports = Cliente;