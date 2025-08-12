// middlewares/validateRegister.js
const validateRegister = (req, res, next) => {
  const { nombres, username, password } = req.body;
  
  if(!nombres || !username || !password) {
    req.flash('error_msg', 'Todos los campos son obligatorios');
    return res.redirect('/register');
  }
  
  if(password.length < 8) {
    req.flash('error_msg', 'La contraseña debe tener al menos 8 caracteres');
    return res.redirect('/register');
  }
  
  next();
};

module.exports = validateRegister;