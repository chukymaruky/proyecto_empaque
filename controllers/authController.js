// controllers/authController.js
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

exports.login = async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { nombre_usuario } });

    if (!usuario) {
      return res.render('login', { error: 'Usuario no encontrado' });
    }

    const valido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!valido) {
      return res.render('login', { error: 'Contraseña incorrecta' });
    }

    // Guardamos la sesión
   req.session.usuario = {
    id: usuario.pk_usuario,
    rol: usuario.fk_rol,            // → 1, 2, 3
    nombre: usuario.nombre_usuario,
    empaque: usuario.fk_empaque     // solo si no es admin
};
req.session.usuario.empaqueSeleccionado = empaqueElegidoId;



    // Redirección según rol
    switch (usuario.fk_rol) {
      case 1: res.redirect('/dashboard/admin'); break;
      case 2: res.redirect('/dashboard/supervisor'); break;
      case 3: res.redirect('/dashboard/empleado'); break;
      default: res.redirect('/');
    }

  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error interno' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
