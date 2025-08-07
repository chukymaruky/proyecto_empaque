// models/DatoPersona.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DatoPersona = sequelize.define('dato_persona', {
  pk_dato_persona: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombres: { type: DataTypes.STRING, allowNull: false },
  primer_apellido: { type: DataTypes.STRING, allowNull: false },
  segundo_apellido: DataTypes.STRING,
  fk_empaque: DataTypes.INTEGER,
  hora: { type: DataTypes.TIME, defaultValue: sequelize.literal('CURRENT_TIME') },
  fecha: { type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_DATE') },
  estado: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'dato_persona',
  timestamps: false
});

module.exports = DatoPersona;
