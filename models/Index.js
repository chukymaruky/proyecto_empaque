// models/index.js
const Empaque = require('./Empaque');
const Rol = require('./Rol');
const DatoPersona = require('./DatoPersona');
const Usuario = require('./Usuario');
const Empresa = require('./Empresa');
const Proveedor = require('./Proveedor');
const CategoriaProducto = require('./CategoriaProducto');
const TipoVehiculo = require('./TipoVehiculo');
const Transportista = require('./Transportista');
const Transporte = require('./Transporte');
const DetalleTransporte = require('./DetalleTransporte');
const Pedido = require('./Pedido');
const Cliente = require('./Cliente');
const TipoUnidad = require('./TipoUnidad');
const ProductoProcesado = require('./ProductoProcesado');
const VentaProducto = require('./VentaProducto');
const TipoGasto = require('./TipoGasto');
const Gasto = require('./Gasto');
const Empleado = require('./Empleado');
const Salario = require('./Salario');

module.exports = {
  Empaque,
  Rol,
  DatoPersona,
  Usuario,
  Empresa,
  Proveedor,
  CategoriaProducto,
  TipoVehiculo,
  Transportista,
  Transporte,
  DetalleTransporte,
  Pedido,
  Cliente,
  TipoUnidad,
  ProductoProcesado,
  VentaProducto,
  TipoGasto,
  Gasto,
  Empleado,
  Salario
};

// Asociación: Usuario → DatoPersona
Usuario.belongsTo(DatoPersona, { foreignKey: 'fk_dato_persona' });
DatoPersona.hasOne(Usuario, { foreignKey: 'fk_dato_persona' });

// Asociación: Usuario → Rol
Usuario.belongsTo(Rol, { foreignKey: 'fk_rol' });
Rol.hasMany(Usuario, { foreignKey: 'fk_rol' });

// Asociación: Usuario → Empaque
Usuario.belongsTo(Empaque, { foreignKey: 'fk_empaque' });
Empaque.hasMany(Usuario, { foreignKey: 'fk_empaque' });