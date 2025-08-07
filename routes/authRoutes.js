// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const Empaque = require('../models/Empaque');
const Rol = require('../models/Rol');


router.get('/', (req, res) => res.render('login', { error: null }));
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});
router.post('/register', userController.registrarUsuario);


router.get('/register', async (req, res) => {
  const empaques = await Empaque.findAll();
  const roles = await Rol.findAll();
  res.render('register', { empaques, roles, error: null });
});

module.exports = router;