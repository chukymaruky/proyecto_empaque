const express = require('express');
const router = express.Router();
const transporteController = require('../../controllers/admin/transporteController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de transportes
router.get('/transportes', transporteController.listTransportes);
router.get('/transportes/add', transporteController.showAddForm);
router.post('/transportes/add', transporteController.addTransporte);
router.get('/transportes/edit/:id', transporteController.showEditForm);
router.post('/transportes/edit/:id', transporteController.updateTransporte);
router.post('/transportes/delete/:id', transporteController.deleteTransporte);

module.exports = router;