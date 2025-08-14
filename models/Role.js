const pool = require('../config/database');

class Role {
  // Obtener roles por empaque
  static async getByEmpaque(fk_empaque) {
    const query = 'SELECT * FROM rol WHERE fk_empaque = $1 OR fk_empaque IS NULL';
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  // Obtener rol por ID
  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM rol WHERE pk_rol = $1', [id]);
    return rows[0];
  }

    // Obtener todos los roles
    static async getAll() {
      const { rows } = await pool.query('SELECT * FROM rol');
      return rows;
    }
}

module.exports = Role;