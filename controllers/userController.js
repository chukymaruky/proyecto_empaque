const User = require('../models/User');
const Role = require('../models/Role');
const Empaque = require('../models/empaque');

const userController = {
  showAddForm: async (req, res) => {
    try {
      const roles = await Role.getAll();
      const empaques = await Empaque.getAll();
      // Renderizar el formulario de creación de usuario
      res.render('admin/users/add', {
        user: req.session.user,
        roles,
        empaques,
        formData: null,
        errors: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/users');
    }
  },

  addUser: async (req, res) => {
    const {
      username,
      password,
      confirm_password,
      nombres,
      primer_apellido,
      segundo_apellido,
      role_id,
      empaque_id
    } = req.body;

    const errors = [];

    // Validaciones
    if (password !== confirm_password) {
      errors.push({ msg: 'Las contraseñas no coinciden' });
    }
    if (password.length < 8) {
      errors.push({ msg: 'La contraseña debe tener al menos 8 caracteres' });
    }

    try {
      // Verificar disponibilidad de username
      const isAvailable = await User.isUsernameAvailable(username);
      if (!isAvailable) {
        errors.push({ msg: 'El nombre de usuario ya está en uso' });
      }

      if (errors.length > 0) {
        const roles = await Role.getAll();
        const empaques = await Empaque.getAll();
        
        return res.render('admin/users/add', {
          user: req.session.user,
          roles,
          empaques,
          formData: req.body,
          errors
        });
      }

      // Crear usuario
      await User.createWithDetails({
        username,
        password,
        nombres,
        primer_apellido,
        segundo_apellido,
        fk_rol: role_id,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Usuario registrado exitosamente');
      res.redirect('/admin/users');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al registrar el usuario');
      res.redirect('/admin/users/add');
    }
  },

checkUsername: async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ available: false });
    }
    
    const isAvailable = await User.isUsernameAvailable(username);
    res.json({ available: isAvailable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ available: false });
  }
},

listUsers: async (req, res) => {
  try {
    const users = await User.getAllWithDetails();
    const empaques = await Empaque.getAllActive(); // Asegúrate de tener este método
    
    res.render('admin/users/list', {
      user: req.session.user,
      users,
      empaques, // Pasamos la lista de empaques para el filtro
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error al cargar usuarios');
    res.redirect('/admin');
  }
}
}

module.exports = userController;