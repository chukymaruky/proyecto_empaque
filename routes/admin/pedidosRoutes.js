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
router.get('/pedidos/edit/:id', pedidoController.showEditForm);
router.post('/pedidos/edit/:id', pedidoController.updatePedido);
router.get('/pedidos/by-empaque/:empaqueId', pedidoController.getPedidosByEmpaque);

module.exports = router;