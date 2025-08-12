const express = require('express');
const router = express.Router();
const proveedorController = require('../../controllers/proveedorController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Aplicar middlewares a todas las rutas
router.use(isAuthenticated, checkRole(['administrador']));

// Rutas de proveedores
router.get('/proveedores', proveedorController.listProveedores);
router.get('/proveedores/add', proveedorController.showAddForm);
router.post('/proveedores/add', proveedorController.addProveedor);

module.exports = router;