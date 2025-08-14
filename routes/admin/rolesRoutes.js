const express = require('express');
const router = express.Router();
const rolController = require('../../controllers/admin/rolController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');


// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador']));

// Rutas de roles
router.get('/rol', rolController.listRoles);
router.get('/rol/add', rolController.showAddForm);
router.post('/rol/add', rolController.addRol);
router.post('/rol/delete/:id', rolController.deleteRol);

module.exports = router;