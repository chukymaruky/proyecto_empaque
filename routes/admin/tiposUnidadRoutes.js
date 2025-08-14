const express = require('express');
const router = express.Router();
const tipoUnidadController = require('../../controllers/admin/tipoUnidadController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de tipos de unidad
router.get('/tipos-unidad', tipoUnidadController.listTiposUnidad);
router.get('/tipos-unidad/add', tipoUnidadController.showAddForm);
router.post('/tipos-unidad/add', tipoUnidadController.addTipoUnidad);
router.get('/tipos-unidad/edit/:id', tipoUnidadController.showEditForm);
router.post('/tipos-unidad/edit/:id', tipoUnidadController.updateTipoUnidad);
router.post('/tipos-unidad/delete/:id', tipoUnidadController.deleteTipoUnidad);

module.exports = router;