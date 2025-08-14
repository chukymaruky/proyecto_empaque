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
    SELECT p.*, dp.nombres, dp.primer_apellido, e.razon_social
    FROM proveedor p
    JOIN dato_persona dp ON p.fk_dato_persona = dp.pk_dato_persona
    LEFT JOIN empresa e ON p.fk_empresa = e.pk_empresa
  `;
  const { rows } = await pool.query(query);
  return rows;
}


  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT p.*, dp.nombres, dp.primer_apellido, e.razon_social
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