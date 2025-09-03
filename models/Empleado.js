const pool = require('../config/database');

class Empleado {
  static async create({ fk_usuario, fk_empaque }) {
    const query = `
      INSERT INTO empleado 
      (fk_usuario, fk_empaque) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    const values = [fk_usuario, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT e.*, u.nombre_usuario, dp.nombres, dp.primer_apellido, r.rol,
             emp.nombre_empaque, emp.pk_empaque
      FROM empleado e
      JOIN usuario u ON e.fk_usuario = u.pk_usuario
      JOIN dato_persona dp ON u.fk_dato_persona = dp.pk_dato_persona
      JOIN rol r ON u.fk_rol = r.pk_rol
      JOIN empaque emp ON e.fk_empaque = emp.pk_empaque
      WHERE e.fk_empaque = $1 AND e.estado = true
      ORDER BY dp.nombres, dp.primer_apellido
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getAll() {
    const query = `
      SELECT e.*, u.nombre_usuario, dp.nombres, dp.primer_apellido, r.rol,
             emp.nombre_empaque, emp.pk_empaque
      FROM empleado e
      JOIN usuario u ON e.fk_usuario = u.pk_usuario
      JOIN dato_persona dp ON u.fk_dato_persona = dp.pk_dato_persona
      JOIN rol r ON u.fk_rol = r.pk_rol
      JOIN empaque emp ON e.fk_empaque = emp.pk_empaque
      WHERE e.estado = true
      ORDER BY dp.nombres, dp.primer_apellido
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getAllActive() {
    const query = `
      SELECT e.*, u.nombre_usuario, dp.nombres, dp.primer_apellido, r.rol,
             emp.nombre_empaque, emp.pk_empaque
      FROM empleado e
      JOIN usuario u ON e.fk_usuario = u.pk_usuario
      JOIN dato_persona dp ON u.fk_dato_persona = dp.pk_dato_persona
      JOIN rol r ON u.fk_rol = r.pk_rol
      JOIN empaque emp ON e.fk_empaque = emp.pk_empaque
      WHERE e.estado = true AND emp.estado = true
      ORDER BY dp.nombres, dp.primer_apellido
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async isUserAlreadyEmployee(fk_usuario) {
    const query = 'SELECT 1 FROM empleado WHERE fk_usuario = $1';
    const { rows } = await pool.query(query, [fk_usuario]);
    return rows.length > 0;
  }

  static async updateUserRole(userId, rolId) {
    const query = `
      UPDATE usuario 
      SET fk_rol = $1
      WHERE pk_usuario = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [rolId, userId]);
    return rows[0];
  }
}

module.exports = Empleado;