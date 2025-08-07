// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.get('/', (req, res) => res.render('login', { error: null }));
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});
router.post('/register', userController.registrarUsuario);

module.exports = router;