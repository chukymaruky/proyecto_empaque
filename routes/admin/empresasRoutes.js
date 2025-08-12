const express = require('express');
const router = express.Router();
const empresaController = require('../../controllers/empresaController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador']));

// Rutas de empresas
router.get('/empresas', empresaController.listEmpresas);
router.get('/empresas/add', empresaController.showAddForm);
router.post('/empresas/add', empresaController.addEmpresa);

module.exports = router;