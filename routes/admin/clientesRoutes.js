const express = require('express');
const router = express.Router();
const clienteController = require('../../controllers/admin/clienteController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de clientes
router.get('/clientes', clienteController.listClientes);
router.get('/clientes/add', clienteController.showAddForm);
router.post('/clientes/add', clienteController.addCliente);

module.exports = router;