exports.adminDebeElegirEmpaque = (req, res, next) => {
  if (req.session.usuario?.rol === 1 && !req.session.usuario.empaqueSeleccionado) {
    return res.redirect('/seleccionar-empaque');
  }
  next();
};
