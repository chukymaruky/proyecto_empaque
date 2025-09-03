//models/proveedor.js

const pool = require('../config/database');

class Proveedor {
  static async create({ fk_dato_persona, fk_empresa, fk_empaque }) {
    const query = `
      INSERT INTO proveedor 
      (fk_dato_persona, fk_empresa, fk_empaque) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [fk_dato_persona, fk_empresa, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAll() {
    const query = `
      SELECT p.*, 
             dp.nombres, 
             dp.primer_apellido, 
             e.razon_social,
             emp.nombre_empaque
      FROM proveedor p
      JOIN dato_persona dp ON p.fk_dato_persona = dp.pk_dato_persona
      LEFT JOIN empresa e ON p.fk_empresa = e.pk_empresa
      JOIN empaque emp ON p.fk_empaque = emp.pk_empaque
      WHERE p.estado = true
      ORDER BY emp.nombre_empaque, dp.nombres
    `;
    const { rows } = await pool.query(query);
    return rows;
  }


  static async getAllByEmpaque(fk_empaque) {
  const query = `
    SELECT p.*, 
           dp.nombres, 
           dp.primer_apellido, 
           COALESCE(e.nombre_comercial, e.razon_social) as nombre_proveedor
    FROM proveedor p
    JOIN dato_persona dp ON p.fk_dato_persona = dp.pk_dato_persona
    LEFT JOIN empresa e ON p.fk_empresa = e.pk_empresa
    WHERE p.fk_empaque = $1
  `;
  const { rows } = await pool.query(query, [fk_empaque]);
  return rows;
}
}

module.exports = Proveedor;