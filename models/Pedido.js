// models/Pedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('pedido', {
  pk_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_proveedor: DataTypes.INTEGER,
  fk_categoria_producto: DataTypes.INTEGER,
  fk_transporte: DataTypes.INTEGER,
  fk_empaque: DataTypes.INTEGER,
  peso_pedido: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false
  },
  dia_hora_llegada: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado_pedido: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  observaciones: DataTypes.TEXT,
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
  tableName: 'pedido',
  timestamps: false,
  freezeTableName: true
});

module.exports = Pedido;