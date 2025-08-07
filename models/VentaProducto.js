// models/VentaProducto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VentaProducto = sequelize.define('venta_producto', {
  pk_venta_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad_producto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fk_producto_procesado: DataTypes.INTEGER,
  fk_tipo_unidad: DataTypes.INTEGER,
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
  tableName: 'venta_producto',
  timestamps: false,
  freezeTableName: true
});

module.exports = VentaProducto;