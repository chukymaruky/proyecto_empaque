// models/Empleado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empleado = sequelize.define('empleado', {
  pk_empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fk_usuario: DataTypes.INTEGER,
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
  tableName: 'empleado',
  timestamps: false,
  freezeTableName: true
});

module.exports = Empleado;