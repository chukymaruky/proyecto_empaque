const express = require('express');
const router = express.Router();
const empleadoController = require('../../controllers/admin/empleadoController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');


// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador']));

// Rutas de empleados
router.get('/empleados', empleadoController.listEmpleados);
router.get('/empleados/add', empleadoController.showAddForm);
router.post('/empleados/add', empleadoController.addEmpleado);
router.get('/empleados/roles/:empaque_id', empleadoController.getRolesByEmpaque);

module.exports = router;