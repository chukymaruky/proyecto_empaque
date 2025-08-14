const Empaque = require('../models/empaque');
const User = require('../models/User');

const adminController = {
  // Dashboard del administrador
  dashboard: async (req, res) => {
    try {
      const empaques = await Empaque.getAll();
      const selectedEmpaque = req.query.empaque_id 
        ? await Empaque.getById(req.query.empaque_id)
        : null;
      
      res.render('admin/dashboard', {
        user: req.session.user,
        empaques,
        selectedEmpaque
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el dashboard');
    }
  },

  // Gestión de usuarios
  manageUsers: async (req, res) => {
    try {
      const empaques = await Empaque.getAllActive();
      const empaqueId = req.query.empaque_id;
      let users;
      if (empaqueId) {
        users = await User.getByEmpaque(empaqueId);
      } else {
        users = await User.getAllWithDetails();
      }
      res.render('admin/users/list', {
        user: req.session.user,
        users,
        empaques,
        selectedEmpaque: empaqueId || '',
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar la lista de usuarios');
      res.redirect('/admin');
    }
  },
  
  listUsers: async (req, res) => {
    try {
      const users = await User.getAllWithDetails();
      const empaques = await Empaque.getAllActive(); // Obtener todos los empaques activos

      res.render('admin/users/list', {
        user: req.session.user,
        users,
        empaques, // Pasamos los empaques a la vista
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar usuarios');
      res.redirect('/admin');
    }
  } 
};

module.exports = adminController;