    const pool = require('../config/database');

class Rol {
  static async create({ rol, fk_empaque }) {
    const query = `
      INSERT INTO rol 
      (rol, fk_empaque) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    const values = [rol, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAll() {
  const query = `
    SELECT r.*, e.nombre_empaque
    FROM rol r
    JOIN empaque e ON r.fk_empaque = e.pk_empaque
    WHERE r.estado = true
    ORDER BY e.nombre_empaque, r.rol
  `;
  const { rows } = await pool.query(query);
  return rows;
}

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT r.*, e.nombre_empaque
      FROM rol r
      JOIN empaque e ON r.fk_empaque = e.pk_empaque
      WHERE r.fk_empaque = $1 AND r.estado = true
      ORDER BY r.rol
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_rol, fk_empaque) {
    const query = `
      SELECT * FROM rol 
      WHERE pk_rol = $1 AND fk_empaque = $2 AND estado = true
    `;
    const { rows } = await pool.query(query, [pk_rol, fk_empaque]);
    return rows[0];
  }

  static async update({ pk_rol, rol, fk_empaque }) {
    const query = `
      UPDATE rol 
      SET rol = $1
      WHERE pk_rol = $2 AND fk_empaque = $3
      RETURNING *
    `;
    const values = [rol, pk_rol, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(pk_rol, fk_empaque) {
    const query = `
      UPDATE rol 
      SET estado = false
      WHERE pk_rol = $1 AND fk_empaque = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [pk_rol, fk_empaque]);
    return rows[0];
  }

  static async isRoleExists(rol, fk_empaque, excludeId = null) {
    let query = `
      SELECT 1 FROM rol 
      WHERE rol = $1 AND fk_empaque = $2 AND estado = true
    `;
    const values = [rol, fk_empaque];
    
    if (excludeId) {
      query += ` AND pk_rol != $3`;
      values.push(excludeId);
    }

    const { rows } = await pool.query(query, values);
    return rows.length > 0;
  }
}

module.exports = Rol;