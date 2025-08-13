const express = require('express');
const router = express.Router();
const gastoController = require('../../controllers/admin/gastoController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de gastos
router.get('/gastos', gastoController.listGastos);
router.get('/gastos/add', gastoController.showAddForm);
router.post('/gastos/add', gastoController.addGasto);

module.exports = router;