// Middleware para verificar el rol del usuario
function checkRole(roles) {
  return function(req, res, next) {
    if (req.session.user && roles.includes(req.session.user.rol_nombre)) {
      return next();
    }
    res.status(403).send('Acceso denegado');
  };
}

module.exports = checkRole;