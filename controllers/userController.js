// controllers/userController.js
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const DatoPersona = require('../models/DatoPersona');

exports.registrarUsuario = async (req, res) => {
  const {
    nombre_usuario,
    contraseña,
    confirmar_contraseña,
    nombres,
    primer_apellido,
    segundo_apellido,
    fk_rol,
    fk_empaque
  } = req.body;

  try {
    // Validación de contraseñas
    if (contraseña !== confirmar_contraseña) {
      return res.render('register', { error: 'Las contraseñas no coinciden' });
    }

    // Verificar si ya existe un usuario con ese nombre
    const existe = await Usuario.findOne({ where: { nombre_usuario } });
    if (existe) {
      return res.render('register', { error: 'El nombre de usuario ya existe' });
    }

    // Cifrar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear dato_persona
    const persona = await DatoPersona.create({
      nombres,
      primer_apellido,
      segundo_apellido,
      fk_empaque
    });

    // Crear usuario
    await Usuario.create({
      nombre_usuario,
      contraseña: hashedPassword,
      fk_dato_persona: persona.pk_dato_persona,
      fk_rol,
      fk_empaque
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Error al registrar usuario' });
  }
};
