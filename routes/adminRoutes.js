const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const proveedoresRoutes = require('./admin/proveedoresRoutes');
const empresasRoutes = require('./admin/empresasRoutes');
const usersRoutes = require('./admin/usersRoutes');
const categoriasRoutes = require('./admin/categoriasRoutes');
const clientesRoutes = require('./admin/clientesRoutes');
const empleadosRoutes = require('./admin/empleadosRoutes');
const gastosRoutes = require('./admin/gastosRoutes');
const pedidosRoutes = require('./admin/pedidosRoutes');
const productosProcesadosRoutes = require('./admin/productosProcesadosRoutes');
const rolesRoutes = require('./admin/rolesRoutes');

// Solo admin puede acceder
router.use(isAuthenticated, checkRole(['administrador']));

// Rutas del administrador
router.get('/', adminController.dashboard);
router.get('/users', adminController.manageUsers);

// Rutas de proveedores
router.use('/', proveedoresRoutes);
// Rutas de empresas
router.use('/', empresasRoutes);
// Rutas de usuarios
router.use('/', usersRoutes);
// Rutas de clientes
router.use('/', clientesRoutes);
// Rutas de categorias
router.use('/', categoriasRoutes);
// Rutas de empleados
router.use('/', empleadosRoutes);
// Rutas de gastos
router.use('/', gastosRoutes);
// Rutas de pedidos
router.use('/', pedidosRoutes);
// Rutas de productos procesados
router.use('/', productosProcesadosRoutes);
// Rutas de roles
router.use('/', rolesRoutes);

module.exports = router;