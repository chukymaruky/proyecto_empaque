const express = require('express');
const router = express.Router();
const productoProcesadoController = require('../../controllers/admin/productoProcesadoController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador', 'supervisor']));

// Rutas de productos procesados
router.get('/productos-procesados', productoProcesadoController.listProductosProcesados);
router.get('/productos-procesados/add', productoProcesadoController.showAddForm);
router.post('/productos-procesados/add', productoProcesadoController.addProductoProcesado);
router.get('/productos-procesados/edit/:id', productoProcesadoController.showEditForm);
router.post('/productos-procesados/edit/:id', productoProcesadoController.updateProductoProcesado);
router.post('/productos-procesados/delete/:id', productoProcesadoController.deleteProductoProcesado);

module.exports = router;