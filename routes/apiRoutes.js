// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/roles/:empaque_id', authController.getRolesByEmpaque);

module.exports = router;