const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Solo admin puede acceder
router.use(isAuthenticated, checkRole(['administrador']));

// Rutas del administrador
router.get('/', adminController.dashboard);
router.get('/users', adminController.manageUsers);

module.exports = router;