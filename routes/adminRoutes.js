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

module.exports = router;