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
  hora: DataTypes.TIME,
  fecha: DataTypes.DATE,
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuario',         // 👈 evita pluralización
  timestamps: false,            // 👈 desactiva timestamps automáticos
  freezeTableName: true         // 👈 evita que Sequelize cambie el nombre de la tabla
});

module.exports = Usuario;
