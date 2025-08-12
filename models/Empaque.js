const pool = require('../config/database');

class Empaque {
  // Obtener todos los empaques
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM empaque WHERE estado = true');
    return rows;
  }

  // Obtener empaque por ID
  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM empaque WHERE pk_empaque = $1', [id]);
    return rows[0];
  }
}

module.exports = Empaque;