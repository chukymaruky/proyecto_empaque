// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { estaAutenticado } = require('../middlewares/authMiddleware');
const { esAdmin, esSupervisor, esEmpleado } = require('../middlewares/roleMiddleware');

router.get('/admin', estaAutenticado, esAdmin, (req, res) => {
  res.render('adminDashboard', { user: req.session.usuario });
});

router.get('/supervisor', estaAutenticado, esSupervisor, (req, res) => {
  res.render('supervisorDashboard', { user: req.session.usuario });
});

router.get('/empleado', estaAutenticado, esEmpleado, (req, res) => {
  res.render('empleadoDashboard', { user: req.session.usuario });
});

module.exports = router;
