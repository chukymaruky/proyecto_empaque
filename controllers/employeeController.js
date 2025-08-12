const Empaque = require('../models/empaque');

const employeeController = {
  // Dashboard del empleado
  dashboard: async (req, res) => {
    try {
      // Obtener información del empaque asignado al empleado
      const empaque = await Empaque.getById(req.session.user.empaque_id);
      
      res.render('employee/index', {
        user: req.session.user,
        empaque
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el dashboard del empleado');
    }
  },

  // Otras funciones específicas para empleados...
  viewProducts: async (req, res) => {
    // Lógica para ver productos del empaque asignado
    res.render('employee/products', {
      user: req.session.user,
      // productos: [...]
    });
  }
};

module.exports = employeeController;