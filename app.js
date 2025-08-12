require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const apiRoutes = require('./routes/apiRoutes');


// Configuración de la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares básicos (siempre primero)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ↓↓↓↓ AQUÍ VA EL NUEVO MIDDLEWARE API ↓↓↓↓
app.use('/api', (req, res, next) => {
  // Forzar respuestas JSON en todas las rutas /api
  res.setHeader('Content-Type', 'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Configuración de sesión (DEBE ir antes de flash y de las rutas que usan sesión)
const sessionConfig = require('./config/session');
app.use(session(sessionConfig));

// Flash messages (después de session)
app.use(flash());

// Middleware para variables globales de vistas (después de session y flash)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg');
  next();
});

// Rutas (después de todos los middlewares anteriores)
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/supervisor', supervisorRoutes);
app.use('/employee', employeeRoutes);
app.use('/api', apiRoutes); // ← Nueva línea para rutas API

// Ruta de inicio (redirige según rol)
app.get('/', (req, res) => {
  if (req.session.user) {
    switch (req.session.user.rol) {
      case 'administrador':
        return res.redirect('/admin');
      case 'supervisor':
        return res.redirect('/supervisor');
      case 'empleado':
        return res.redirect('/employee');
      default:
        return res.redirect('/login');
    }
  }
  res.redirect('/login');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});