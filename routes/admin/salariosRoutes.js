const express = require('express');
const router = express.Router();
const salarioController = require('../../controllers/admin/salarioController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de salarios
router.get('/salarios', salarioController.listSalarios);
router.get('/salarios/add', salarioController.showAddForm);
router.post('/salarios/add', salarioController.addSalario);
router.get('/salarios/edit/:id', salarioController.showEditForm);
router.post('/salarios/edit/:id', salarioController.updateSalario);
router.post('/salarios/delete/:id', salarioController.deleteSalario);

module.exports = router;