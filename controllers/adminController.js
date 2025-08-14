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
      const users = await User.getAllWithDetails(); // Nuevo método que necesitamos crear
      
      res.render('admin/users/list', {
        user: req.session.user,
        users, // Asegúrate de pasar esta variable
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar la lista de usuarios');
      res.redirect('/admin');
    }
  }
};

module.exports = adminController;