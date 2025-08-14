const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async getByEmpaque(empaqueId) {
    const query = `
      SELECT u.pk_usuario, u.nombre_usuario,
             dp.nombres, dp.primer_apellido,
             r.rol, e.nombre_empaque, u.fk_empaque
      FROM usuario u
      JOIN dato_persona dp ON u.fk_dato_persona = dp.pk_dato_persona
      JOIN rol r ON u.fk_rol = r.pk_rol
      JOIN empaque e ON u.fk_empaque = e.pk_empaque
      WHERE u.fk_empaque = $1
      ORDER BY dp.nombres, dp.primer_apellido
    `;
    const { rows } = await pool.query(query, [empaqueId]);
    return rows;
  }
  static async createWithDetails({ username, password, nombres, primer_apellido, segundo_apellido, fk_rol, fk_empaque }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insertar dato personal
      const personaQuery = `
        INSERT INTO dato_persona 
        (nombres, primer_apellido, segundo_apellido, fk_empaque) 
        VALUES ($1, $2, $3, $4) 
        RETURNING pk_dato_persona
      `;
      const personaValues = [nombres, primer_apellido, segundo_apellido || null, fk_empaque];
      const personaRes = await client.query(personaQuery, personaValues);
      const pk_dato_persona = personaRes.rows[0].pk_dato_persona;

      // 2. Insertar usuario
      const hashedPassword = await bcrypt.hash(password, 10);
      const userQuery = `
        INSERT INTO usuario 
        (nombre_usuario, contraseña, fk_dato_persona, fk_rol, fk_empaque) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
      `;
      const userValues = [username, hashedPassword, pk_dato_persona, fk_rol, fk_empaque];
      const userRes = await client.query(userQuery, userValues);

      await client.query('COMMIT');
      return userRes.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async isUsernameAvailable(username) {
    const query = 'SELECT 1 FROM usuario WHERE nombre_usuario = $1';
    const { rows } = await pool.query(query, [username]);
    return rows.length === 0;
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

  static async getNonEmployees() {
  const query = `
    SELECT u.pk_usuario, u.nombre_usuario, dp.nombres, dp.primer_apellido
    FROM usuario u
    JOIN dato_persona dp ON u.fk_dato_persona = dp.pk_dato_persona
    LEFT JOIN empleado e ON u.pk_usuario = e.fk_usuario
    WHERE e.pk_empleado IS NULL
    ORDER BY dp.nombres, dp.primer_apellido
  `;
  const { rows } = await pool.query(query);
  return rows;
}

static async getAllWithDetails() {
  const query = `
    SELECT u.pk_usuario, u.nombre_usuario, 
           dp.nombres, dp.primer_apellido,
           r.rol, e.nombre_empaque, u.fk_empaque
    FROM usuario u
    JOIN dato_persona dp ON u.fk_dato_persona = dp.pk_dato_persona
    JOIN rol r ON u.fk_rol = r.pk_rol
    JOIN empaque e ON u.fk_empaque = e.pk_empaque
    ORDER BY dp.nombres, dp.primer_apellido
  `;
  const { rows } = await pool.query(query);
  return rows;
}
}

module.exports = User;