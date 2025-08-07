// models/ProductoProcesado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductoProcesado = sequelize.define('producto_procesado', {
  pk_producto_procesado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_categoria_producto: DataTypes.INTEGER,
  fk_pedido: DataTypes.INTEGER,
  fk_empaque: DataTypes.INTEGER,
  fk_tipo_unidad: DataTypes.INTEGER,
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
  tableName: 'producto_procesado',
  timestamps: false,
  freezeTableName: true
});

module.exports = ProductoProcesado;