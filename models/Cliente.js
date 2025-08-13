const pool = require('../config/database');

class Cliente {
  static async create({ fk_empresa, fk_empaque }) {
    const query = `
      INSERT INTO cliente 
      (fk_empresa, fk_empaque) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    const values = [fk_empresa, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT c.*, e.razon_social, e.nombre_comercial, e.rfc
      FROM cliente c
      JOIN empresa e ON c.fk_empresa = e.pk_empresa
      WHERE c.fk_empaque = $1
      ORDER BY e.razon_social
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async isCompanyAlreadyClient(fk_empresa, fk_empaque) {
    const query = `
      SELECT 1 FROM cliente 
      WHERE fk_empresa = $1 AND fk_empaque = $2
    `;
    const { rows } = await pool.query(query, [fk_empresa, fk_empaque]);
    return rows.length > 0;
  }
}

module.exports = Cliente;