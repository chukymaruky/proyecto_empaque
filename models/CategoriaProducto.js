// models/CategoriaProducto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CategoriaProducto = sequelize.define('categoria_producto', {
  pk_categoria_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_categoria: DataTypes.STRING(100),
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
  tableName: 'categoria_producto',
  timestamps: false,
  freezeTableName: true
});

module.exports = CategoriaProducto;