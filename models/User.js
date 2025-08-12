const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Registrar un nuevo usuario
  static async create({ username, password, fk_dato_persona, fk_rol, fk_empaque }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO usuario 
      (nombre_usuario, contraseña, fk_dato_persona, fk_rol, fk_empaque) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING pk_usuario, nombre_usuario, fk_rol, fk_empaque
    `;
    const values = [username, hashedPassword, fk_dato_persona, fk_rol, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Buscar usuario por nombre de usuario
  static async findByUsername(username) {
    const query = `
      SELECT u.pk_usuario, u.nombre_usuario, u.contraseña, u.fk_rol, u.fk_empaque, 
             r.rol as rol_nombre, e.nombre_empaque
      FROM usuario u
      JOIN rol r ON u.fk_rol = r.pk_rol
      JOIN empaque e ON u.fk_empaque = e.pk_empaque
      WHERE u.nombre_usuario = $1
    `;
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }

  // Comparar contraseña
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;