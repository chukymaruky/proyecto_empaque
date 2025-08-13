const express = require('express');
const router = express.Router();
const pedidoController = require('../../controllers/admin/pedidoController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de pedidos
router.get('/pedidos', pedidoController.listPedidos);
router.get('/pedidos/add', pedidoController.showAddForm);
router.post('/pedidos/add', pedidoController.addPedido);
router.get('/pedidos/view/:id', pedidoController.viewPedido);

module.exports = router;