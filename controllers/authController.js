const User = require('../models/user');
const DatoPersona = require('../models/DatoPersona');
const Role = require('../models/Role');
const Empaque = require('../models/empaque');
const bcrypt = require('bcryptjs');

const authController = {
  // Mostrar formulario de login
  showLogin: (req, res) => {
  res.render('auth/login', { 
    user: req.session.user || null,  // Asegurar que user esté definido
    error_msg: req.flash('error_msg')[0],
    success_msg: req.flash('success_msg')[0]
  });
},

  // Procesar login
  login: async (req, res) => {
  const { username, password } = req.body;
    
  try {
    const user = await User.findByUsername(username);
      
    if (!user || !(await User.comparePassword(password, user.contraseña))) {
      req.flash('error_msg', 'Usuario o contraseña incorrectos');
      return res.redirect('/login');
    }
      
    // Guardar TODOS los datos necesarios en sesión
    req.session.user = {
      id: user.pk_usuario,
      username: user.nombre_usuario,
      rol: user.rol_nombre, // Asegúrate que este campo coincide con lo que espera checkRole
      empaque_id: user.fk_empaque,
      empaque_nombre: user.nombre_empaque,
      // Agrega cualquier otro dato necesario
    };

      
       // Redirigir según el rol
    switch (user.rol_nombre) {
      case 'administrador':
        return res.redirect('/admin');
      case 'supervisor':
        return res.redirect('/supervisor');
      case 'empleado':
        return res.redirect('/employee');
      default:
        req.flash('error_msg', 'Rol no reconocido');
        return res.redirect('/login');
    }
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al iniciar sesión');
      res.redirect('/login');
    }
  },

  // Cerrar sesión
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  },

  // Mostrar formulario de registro
  showRegister: async (req, res) => {
  try {
    const empaques = await Empaque.getAll();
    res.render('auth/register', { 
      empaques,
      roles: [], // Inicialmente vacío hasta que seleccionen empaque
      error_msg: req.flash('error_msg')[0],
      user: req.session.user || null
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error al cargar el formulario');
    res.redirect('/register');
  }
},

// Nueva ruta para obtener roles por empaque (AJAX)
// controllers/authController.js
getRolesByEmpaque: async (req, res) => {
  try {
    const { empaque_id } = req.params;
    
    if (!empaque_id || isNaN(empaque_id)) {
      return res.status(400).json({ error: 'ID de empaque inválido' });
    }

    const roles = await Role.getByEmpaque(empaque_id);
    res.json(roles); // Simple respuesta JSON
    
  } catch (error) {
    console.error('Error en getRolesByEmpaque:', error);
    res.status(500).json({ 
      error: 'Error al obtener roles',
      details: error.message
    });
  }
},

  // Procesar registro
  register: async (req, res) => {
    const { 
      nombres, 
      primer_apellido, 
      segundo_apellido, 
      username, 
      password, 
      role_id,
      empaque_id 
    } = req.body;
    
    try {
      // 1. Crear dato personal
      const datoPersona = await DatoPersona.create({
        nombres,
        primer_apellido,
        segundo_apellido: segundo_apellido || null,
        fk_empaque: empaque_id
      });
      
      // 2. Crear usuario
      await User.create({
        username,
        password,
        fk_dato_persona: datoPersona.pk_dato_persona,
        fk_rol: role_id,
        fk_empaque: empaque_id
      });
      
      req.flash('success_msg', 'Usuario registrado exitosamente');
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al registrar el usuario: ' + error.message);
      res.redirect('/register');
    }
  }
};

module.exports = authController;