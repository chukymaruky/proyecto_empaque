const express = require('express');
const router = express.Router();
const tipoVehiculoController = require('../../controllers/admin/tipoVehiculoController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de tipos de vehículo
router.get('/tipos-vehiculo', tipoVehiculoController.listTiposVehiculo);
router.get('/tipos-vehiculo/add', tipoVehiculoController.showAddForm);
router.post('/tipos-vehiculo/add', tipoVehiculoController.addTipoVehiculo);
router.get('/tipos-vehiculo/edit/:id', tipoVehiculoController.showEditForm);
router.post('/tipos-vehiculo/edit/:id', tipoVehiculoController.updateTipoVehiculo);
router.post('/tipos-vehiculo/delete/:id', tipoVehiculoController.deleteTipoVehiculo);

module.exports = router;