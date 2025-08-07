// models/Rol.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol = sequelize.define('rol', {
  pk_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rol: {
    type: DataTypes.STRING(100),
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
  tableName: 'rol',
  timestamps: false,
  freezeTableName: true
});

module.exports = Rol;