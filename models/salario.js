const pool = require('../config/database');

class Salario {
  static async create({ cantidad_salario, fk_empleado, fk_empaque }) {
    const query = `
      INSERT INTO salario 
      (cantidad_salario, fk_empleado, fk_empaque) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [cantidad_salario, fk_empleado, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT s.*, 
             e.pk_empleado,
             dp.nombres || ' ' || dp.primer_apellido AS nombre_empleado,
             emp.nombre_empaque
      FROM salario s
      JOIN empleado e ON s.fk_empleado = e.pk_empleado
      JOIN usuario u ON e.fk_usuario = u.pk_usuario
      JOIN dato_persona dp ON u.fk_dato_persona = dp.pk_dato_persona
      JOIN empaque emp ON s.fk_empaque = emp.pk_empaque
      WHERE s.fk_empaque = $1 AND s.estado = true
      ORDER BY dp.nombres
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_salario, fk_empaque) {
    const query = `
      SELECT s.*, 
             e.pk_empleado,
             dp.nombres || ' ' || dp.primer_apellido AS nombre_empleado
      FROM salario s
      JOIN empleado e ON s.fk_empleado = e.pk_empleado
      JOIN usuario u ON e.fk_usuario = u.pk_usuario
      JOIN dato_persona dp ON u.fk_dato_persona = dp.pk_dato_persona
      WHERE s.pk_salario = $1 AND s.fk_empaque = $2 AND s.estado = true
    `;
    const { rows } = await pool.query(query, [pk_salario, fk_empaque]);
    return rows[0];
  }

  static async update({ pk_salario, cantidad_salario, fk_empaque }) {
    const query = `
      UPDATE salario 
      SET cantidad_salario = $1
      WHERE pk_salario = $2 AND fk_empaque = $3
      RETURNING *
    `;
    const values = [cantidad_salario, pk_salario, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(pk_salario, fk_empaque) {
    const query = `
      UPDATE salario 
      SET estado = false
      WHERE pk_salario = $1 AND fk_empaque = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [pk_salario, fk_empaque]);
    return rows[0];
  }

  static async getEmpleadosByEmpaque(fk_empaque) {
    const query = `
      SELECT e.pk_empleado, 
             dp.nombres || ' ' || dp.primer_apellido AS nombre_completo
      FROM empleado e
      JOIN usuario u ON e.fk_usuario = u.pk_usuario
      JOIN dato_persona dp ON u.fk_dato_persona = dp.pk_dato_persona
      WHERE e.fk_empaque = $1 AND e.estado = true
      ORDER BY dp.nombres
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async hasActiveSalary(fk_empleado) {
    const query = `
      SELECT 1 FROM salario 
      WHERE fk_empleado = $1 AND estado = true
    `;
    const { rows } = await pool.query(query, [fk_empleado]);
    return rows.length > 0;
  }
}

module.exports = Salario;