const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const proveedoresRoutes = require('./admin/proveedoresRoutes');
const empresasRoutes = require('./admin/empresasRoutes');
const usersRoutes = require('./admin/usersRoutes');

// Solo admin puede acceder
router.use(isAuthenticated, checkRole(['administrador']));

// Rutas del administrador
router.get('/', adminController.dashboard);
router.get('/users', adminController.manageUsers);

// Rutas de proveedores
router.use('/', proveedoresRoutes);
// Rutas de empresas
router.use('/', empresasRoutes);
router.use('/', usersRoutes);

module.exports = router;