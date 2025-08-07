// models/Empresa.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = sequelize.define('empresa', {
  pk_empresa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  razon_social: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nombre_comercial: DataTypes.STRING(255),
  rfc: {
    type: DataTypes.STRING(13),
    unique: true
  },
  curp: DataTypes.STRING(18),
  regimen_fiscal: DataTypes.STRING(100),
  domicilio_fiscal: DataTypes.TEXT,
  telefono_contacto: DataTypes.STRING(20),
  email_contacto: DataTypes.STRING(100),
  fecha_constitucion: DataTypes.DATEONLY,
  representante_legal: DataTypes.STRING(255),
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
  tableName: 'empresa',
  timestamps: false,
  freezeTableName: true
});

module.exports = Empresa;