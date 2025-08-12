// middlewares/roleMiddleware.js
function checkRole(roles) {
  return function(req, res, next) {
    // Verificar si el usuario está autenticado
    if (!req.session.user) {
      req.flash('error_msg', 'Por favor inicie sesión');
      return res.redirect('/login');
    }

    // Verificar si el rol del usuario está autorizado
    if (roles.includes(req.session.user.rol)) {
      return next();
    }

    // Si no tiene el rol adecuado
    res.status(403).render('error/403', { 
      user: req.session.user,
      message: 'Acceso denegado: No tienes los permisos necesarios'
    });
  };
}

module.exports = checkRole;