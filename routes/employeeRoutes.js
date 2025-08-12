const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Solo usuarios autenticados con rol de empleado pueden acceder
router.use(isAuthenticated, checkRole(['empleado']));

// Rutas del empleado
router.get('/', employeeController.dashboard);
router.get('/products', employeeController.viewProducts);

module.exports = router;