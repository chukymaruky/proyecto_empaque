const express = require('express');
const router = express.Router();
const ventaProductoController = require('../../controllers/admin/ventaProductoController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de ventas de producto
router.get('/ventas-productos', ventaProductoController.listVentasProducto);
router.get('/ventas-productos/add', ventaProductoController.showAddForm);
router.post('/ventas-productos/add', ventaProductoController.addVentaProducto);

module.exports = router;