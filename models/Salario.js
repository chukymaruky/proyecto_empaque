// models/Salario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Salario = sequelize.define('salario', {
  pk_salario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad_salario: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false
  },
  fk_empleado: {
    type: DataTypes.INTEGER,
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
  tableName: 'salario',
  timestamps: false,
  freezeTableName: true
});

module.exports = Salario;