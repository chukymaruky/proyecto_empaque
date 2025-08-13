const Cliente = require('../../models/Cliente');
const Empresa = require('../../models/Empresa');

const clienteController = {
  showAddForm: async (req, res) => {
    try {
      const empresas = await Empresa.getAll();
      
      res.render('admin/clientes/add', {
        user: req.session.user,
        empresas,
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
    const { empresa_id } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validar que la empresa no sea ya cliente
      const isAlreadyClient = await Cliente.isCompanyAlreadyClient(empresa_id, empaque_id);
      if (isAlreadyClient) {
        req.flash('error_msg', 'Esta empresa ya está registrada como cliente');
        return res.redirect('/admin/clientes/add');
      }

      // Crear cliente
      await Cliente.create({
        fk_empresa: empresa_id,
        fk_empaque: empaque_id
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
      const { empaque_id } = req.session.user;
      const clientes = await Cliente.getAllByEmpaque(empaque_id);

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