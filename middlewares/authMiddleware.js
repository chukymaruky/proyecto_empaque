// middlewares/authMiddleware.js
exports.estaAutenticado = (req, res, next) => {
  if (req.session.usuario) {
    next();
  } else {
    res.redirect('/');
  }
};
