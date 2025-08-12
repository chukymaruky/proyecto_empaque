// config/session.js
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./database');

module.exports = {
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true // Esto crea la tabla si no existe
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
};