// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./config/database'); //para probar la conexión a la base de datos

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Manejo de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));

// Rutas
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// prueba de conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a la base de datos establecida'))
  .catch(err => console.error('❌ Error al conectar:', err));