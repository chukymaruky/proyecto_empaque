// models/Gasto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Gasto = sequelize.define('gasto', {
  pk_gasto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  concepto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Monto: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false
  },
  fk_tipo_gasto: DataTypes.INTEGER,
  fk_pedido: DataTypes.INTEGER,
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
  tableName: 'gasto',
  timestamps: false,
  freezeTableName: true
});

module.exports = Gasto;