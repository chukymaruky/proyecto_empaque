const express = require('express');
const router = express.Router();
const rolController = require('../../controllers/admin/rolController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');


// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador']));

// Rutas de roles
router.get('/roles', rolController.listRoles);
router.get('/roles/add', rolController.showAddForm);
router.post('/roles/add', rolController.addRol);
router.post('/roles/delete/:id', rolController.deleteRol);

module.exports = router;