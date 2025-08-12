const Proveedor = require('../models/proveedor');
const DatoPersona = require('../models/DatoPersona');
const Empresa = require('../models/Empresa');

const proveedorController = {
  showAddForm: async (req, res) => {
    try {
      const empresas = await Empresa.getAll();
      res.render('admin/proveedores/add', {
        user: req.session.user,
        empresas
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/proveedores');
    }
  },

  addProveedor: async (req, res) => {
    const { nombres, apellidos, empresa_id } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // 1. Crear dato personal
      const [nombre, ...otrosNombres] = nombres.split(' ');
      const [primerApellido, segundoApellido] = apellidos.split(' ');

      const datoPersona = await DatoPersona.create({
        nombres: nombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido || null,
        fk_empaque: empaque_id
      });

      // 2. Crear proveedor
      await Proveedor.create({
        fk_dato_persona: datoPersona.pk_dato_persona,
        fk_empresa: empresa_id || null,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Proveedor agregado exitosamente');
      res.redirect('/admin/proveedores');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al registrar proveedor');
      res.redirect('/admin/proveedores/add');
    }
  },

  listProveedores: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const proveedores = await Proveedor.getAllByEmpaque(empaque_id);
      
      res.render('admin/proveedores/list', {
        user: req.session.user,
        proveedores
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar proveedores');
      res.redirect('/admin');
    }
  }
};

module.exports = proveedorController;