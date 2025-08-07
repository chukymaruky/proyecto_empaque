// controllers/dashboardController.js
const { Usuario, DatoPersona, Rol, Empaque } = require('../models');

exports.mostrarDashboard = async (req, res) => {
  try {
    // Verifica que el usuario esté autenticado
    if (!req.session.usuario) {
      return res.redirect('/login');
    }

    // Consulta el usuario con asociaciones
    const usuario = await Usuario.findOne({
      where: { pk_usuario: req.session.usuarioId },
      include: [DatoPersona, Rol, Empaque]
    });

    

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Renderizar vista con datos del usuario
    res.render('dashboard', {
      usuario: {
        id: usuario.pk_usuario,
        nombreUsuario: usuario.nombre_usuario,
        rol: usuario.rol.rol,
        nombres: usuario.dato_persona.nombres,
        primerApellido: usuario.dato_persona.primer_apellido,
        segundoApellido: usuario.dato_persona.segundo_apellido,
        empaque: usuario.empaque.nombre_empaque
      },
      empaqueId: empaqueId
    });

  } catch (error) {
    console.error('Error en mostrarDashboard:', error);
    res.status(500).send('Error interno del servidor');
  }
};
