// middlewares/roleMiddleware.js
exports.esAdmin = (req, res, next) => {
  if (req.session.usuario?.rol === 1) {
    next();
  } else {
    res.status(403).send('Acceso denegado');
  }
};

exports.esSupervisor = (req, res, next) => {
  if (req.session.usuario?.rol === 2) {
    next();
  } else {
    res.status(403).send('Acceso denegado');
  }
};

exports.esEmpleado = (req, res, next) => {
  if (req.session.usuario?.rol === 3) {
    next();
  } else {
    res.status(403).send('Acceso denegado');
  }
};
