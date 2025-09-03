const Empleado = require('../../models/empleado');
const User = require('../../models/User');
const Rol = require('../../models/rol');
const Empaque = require('../../models/empaque');

const empleadoController = {
  showAddForm: async (req, res) => {
    try {      
      // Obtener usuarios que no son empleados
      const usuarios = await User.getNonEmployees();
      
      // Obtener empaques según el rol del usuario
      let empaques = [];
      if (req.session.user.rol === 'administrador') {
        empaques = await Empaque.getAllActive();
      } else {
        empaques = [{
          pk_empaque: req.session.user.empaque_id,
          nombre_empaque: req.session.user.nombre_empaque
        }];
      }
      
      res.render('admin/empleados/add', {
        user: req.session.user,
        usuarios,
        empaques,
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
    const { usuario_id, rol_id, empaque_id: selectedEmpaqueId } = req.body;
    let empaqueId;

    // Determinar el empaque según el rol del usuario
    if (req.session.user.rol === 'administrador') {
      empaqueId = selectedEmpaqueId;
    } else {
      empaqueId = req.session.user.empaque_id;
    }

    try {
      // Validar que el usuario no sea ya empleado
      const isAlreadyEmployee = await Empleado.isUserAlreadyEmployee(usuario_id);
      if (isAlreadyEmployee) {
        req.flash('error_msg', 'Este usuario ya está registrado como empleado');
        return res.redirect('/admin/empleados/add');
      }

      // Actualizar el rol del usuario
      await User.updateUserRole(usuario_id, rol_id);

      // Crear empleado
      await Empleado.create({
        fk_usuario: usuario_id,
        fk_empaque: empaqueId
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
      let empleados = [];
      let empaques = [];
      const { empaque_id } = req.session.user;
      const Empaque = require('../../models/empaque');

      // Obtener la lista de empaques según el rol
      if (req.session.user.rol === 'administrador') {
        // Si es admin, obtener todos los empaques activos
        empaques = await Empaque.getAllActive();
        empleados = await Empleado.getAll();
      } else {
        // Si no es admin, solo obtener su empaque y sus empleados
        empaques = [{
          pk_empaque: empaque_id,
          nombre_empaque: req.session.user.nombre_empaque
        }];
        empleados = await Empleado.getAllByEmpaque(empaque_id);
      }

      res.render('admin/empleados/list', {
        user: req.session.user,
        empleados: empleados || [],
        empaques: empaques || [],
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar empleados:', error);
      req.flash('error_msg', 'Error al cargar los empleados');
      res.redirect('/admin');
    }
  },

  // Endpoint para obtener roles por empaque
  getRolesByEmpaque: async (req, res) => {
    try {
      const { empaque_id } = req.params;
      const roles = await Rol.getAllByEmpaque(empaque_id);
      res.json(roles);
    } catch (error) {
      console.error('Error al obtener roles:', error);
      res.status(500).json({ error: 'Error al obtener roles' });
    }
  }
}

module.exports = empleadoController;