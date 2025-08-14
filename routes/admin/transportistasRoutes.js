const express = require('express');
const router = express.Router();
const transportistaController = require('../../controllers/admin/transportistaController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de transportistas
router.get('/transportistas', transportistaController.listTransportistas);
router.get('/transportistas/add', transportistaController.showAddForm);
router.post('/transportistas/add', transportistaController.addTransportista);
router.get('/transportistas/edit/:id', transportistaController.showEditForm);
router.post('/transportistas/edit/:id', transportistaController.updateTransportista);
router.post('/transportistas/delete/:id', transportistaController.deleteTransportista);

module.exports = router;