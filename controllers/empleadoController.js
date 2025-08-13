const Empleado = require('../../models/Empleado');
const User = require('../../models/User');

const empleadoController = {
  showAddForm: async (req, res) => {
    try {
      // Obtener usuarios que no son empleados
      const usuarios = await User.getNonEmployees();
      
      res.render('admin/empleados/add', {
        user: req.session.user,
        usuarios,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/empleados');
    }
  },

  addEmpleado: async (req, res) => {
    const { usuario_id } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validar que el usuario no sea ya empleado
      const isAlreadyEmployee = await Empleado.isUserAlreadyEmployee(usuario_id);
      if (isAlreadyEmployee) {
        req.flash('error_msg', 'Este usuario ya está registrado como empleado');
        return res.redirect('/admin/empleados/add');
      }

      // Crear empleado
      await Empleado.create({
        fk_usuario: usuario_id,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Empleado registrado exitosamente');
      res.redirect('/admin/empleados');
    } catch (error) {
      console.error('Error al crear empleado:', error);
      req.flash('error_msg', 'Error al registrar el empleado');
      res.redirect('/admin/empleados/add');
    }
  },

  listEmpleados: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const empleados = await Empleado.getAllByEmpaque(empaque_id);

      res.render('admin/empleados/list', {
        user: req.session.user,
        empleados,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar empleados:', error);
      req.flash('error_msg', 'Error al cargar los empleados');
      res.redirect('/admin');
    }
  }
};

module.exports = empleadoController;