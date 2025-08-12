// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Middleware para verificar si el usuario NO está autenticado
function isNotAuthenticated(req, res, next) {
  if (!req.session.user) {
    return next();
  }
  res.redirect('/');
}

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};