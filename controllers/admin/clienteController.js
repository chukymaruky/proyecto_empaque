const Cliente = require('../../models/Cliente');
const Empresa = require('../../models/Empresa');
const Empaque = require('../../models/empaque');

const clienteController = {
  showAddForm: async (req, res) => {
    try {
      const empresas = await Empresa.getAll();
      let empaques = [];
      
      // Si es administrador, obtener lista de empaques
      if (req.session.user.rol === 'administrador') {
        empaques = await Empaque.getAllActive();
      }
      
      res.render('admin/clientes/add', {
        user: req.session.user,
        empresas,
        empaques: empaques || [], // Asegurarnos de que siempre sea un array
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/clientes');
    }
  },

  addCliente: async (req, res) => {
    const { empresa_id, empaque_id: selectedEmpaqueId } = req.body;
    let empaqueId;

    // Si es administrador, usar el empaque seleccionado, si no, usar el del usuario
    if (req.session.user.rol === 'administrador' && selectedEmpaqueId) {
      empaqueId = selectedEmpaqueId;
    } else {
      empaqueId = req.session.user.empaque_id;
    }

    try {
      // Validar que la empresa no sea ya cliente en ese empaque
      const isAlreadyClient = await Cliente.isCompanyAlreadyClient(empresa_id, empaqueId);
      if (isAlreadyClient) {
        req.flash('error_msg', 'Esta empresa ya está registrada como cliente en este empaque');
        return res.redirect('/admin/clientes/add');
      }

      // Crear cliente
      await Cliente.create({
        fk_empresa: empresa_id,
        fk_empaque: empaqueId
      });

      req.flash('success_msg', 'Cliente registrado exitosamente');
      res.redirect('/admin/clientes');
    } catch (error) {
      console.error('Error al crear cliente:', error);
      req.flash('error_msg', 'Error al registrar el cliente');
      res.redirect('/admin/clientes/add');
    }
  },

  listClientes: async (req, res) => {
    try {
      let clientes;
      const { empaque_id } = req.session.user;

      if (req.session.user.rol === 'administrador') {
        // Si es admin, puede ver todos los clientes
        clientes = await Cliente.getAll();
      } else {
        // Si no es admin, solo ve los clientes de su empaque
        clientes = await Cliente.getAllByEmpaque(empaque_id);
      }

      res.render('admin/clientes/list', {
        user: req.session.user,
        clientes,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar clientes:', error);
      req.flash('error_msg', 'Error al cargar los clientes');
      res.redirect('/admin');
    }
  }
};

module.exports = clienteController;