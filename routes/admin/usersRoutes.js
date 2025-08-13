const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const checkRole = require('../../middlewares/roleMiddleware');

// Middleware para todas las rutas
router.use(isAuthenticated, checkRole(['administrador']));

// Rutas de usuarios
router.get('/users', userController.listUsers);
router.get('/users/add', userController.showAddForm);
router.post('/users/add', userController.addUser);
router.get('/users/check-username', userController.checkUsername);

module.exports = router;