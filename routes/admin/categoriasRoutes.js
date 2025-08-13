const express = require('express');
const router = express.Router();
const categoriaController = require('../../controllers/admin/categoriaController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de categorías
router.get('/categorias', categoriaController.listCategorias);
router.get('/categorias/add', categoriaController.showAddForm);
router.post('/categorias/add', categoriaController.addCategoria);

module.exports = router;