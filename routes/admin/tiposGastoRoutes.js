const express = require('express');
const router = express.Router();
const tipoGastoController = require('../../controllers/admin/tipoGastoController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de tipos de gasto
router.get('/tipos-gasto', tipoGastoController.listTiposGasto);
router.get('/tipos-gasto/add', tipoGastoController.showAddForm);
router.post('/tipos-gasto/add', tipoGastoController.addTipoGasto);
router.get('/tipos-gasto/edit/:id', tipoGastoController.showEditForm);
router.post('/tipos-gasto/edit/:id', tipoGastoController.updateTipoGasto);
router.post('/tipos-gasto/delete/:id', tipoGastoController.deleteTipoGasto);

module.exports = router;