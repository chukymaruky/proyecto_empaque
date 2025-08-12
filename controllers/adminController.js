const Empaque = require('../models/empaque');

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
    // Implementar lógica para gestionar usuarios
    res.render('admin/manage-users', { user: req.session.user });
  }
};

module.exports = adminController;