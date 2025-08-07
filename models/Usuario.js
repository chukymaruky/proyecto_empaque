// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('usuario', {
  pk_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fk_dato_persona: DataTypes.INTEGER,
  fk_rol: DataTypes.INTEGER,
  fk_empaque: DataTypes.INTEGER,
  hora: {
    type: DataTypes.TIME,
    defaultValue: Sequelize.literal('CURRENT_TIME')
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_DATE')
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuario',
  timestamps: false
});

module.exports = Usuario;
