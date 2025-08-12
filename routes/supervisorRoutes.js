const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/supervisorController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Solo usuarios autenticados con rol de supervisor pueden acceder
router.use(isAuthenticated, checkRole(['supervisor']));

// Rutas del supervisor
router.get('/', supervisorController.dashboard);
router.get('/reports', supervisorController.viewReports);
router.get('/employees', supervisorController.manageEmployees);

module.exports = router;