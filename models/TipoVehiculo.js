// models/TipoVehiculo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoVehiculo = sequelize.define('tipo_vehiculo', {
  pk_tipo_vehiculo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_vehiculo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  capacidad_carga_kg: {
    type: DataTypes.DECIMAL(9, 2),
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
  tableName: 'tipo_vehiculo',
  timestamps: false,
  freezeTableName: true
});

module.exports = TipoVehiculo;