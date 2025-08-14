const pool = require('../config/database');

class TipoGasto {
  static async create({ tipo_gasto, fk_empaque }) {
    const query = `
      INSERT INTO tipo_gasto 
      (tipo_gasto, fk_empaque) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    const values = [tipo_gasto, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT tg.*, e.nombre_empaque
      FROM tipo_gasto tg
      JOIN empaque e ON tg.fk_empaque = e.pk_empaque
      WHERE tg.fk_empaque = $1 AND tg.estado = true
      ORDER BY tg.tipo_gasto
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_tipo_gasto, fk_empaque) {
    const query = `
      SELECT * FROM tipo_gasto 
      WHERE pk_tipo_gasto = $1 AND fk_empaque = $2 AND estado = true
    `;
    const { rows } = await pool.query(query, [pk_tipo_gasto, fk_empaque]);
    return rows[0];
  }

  static async update({ pk_tipo_gasto, tipo_gasto, fk_empaque }) {
    const query = `
      UPDATE tipo_gasto 
      SET tipo_gasto = $1
      WHERE pk_tipo_gasto = $2 AND fk_empaque = $3
      RETURNING *
    `;
    const values = [tipo_gasto, pk_tipo_gasto, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(pk_tipo_gasto, fk_empaque) {
    const query = `
      UPDATE tipo_gasto 
      SET estado = false
      WHERE pk_tipo_gasto = $1 AND fk_empaque = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [pk_tipo_gasto, fk_empaque]);
    return rows[0];
  }

  static async isTipoGastoExists(tipo_gasto, fk_empaque, excludeId = null) {
    let query = `
      SELECT 1 FROM tipo_gasto 
      WHERE tipo_gasto = $1 AND fk_empaque = $2 AND estado = true
    `;
    const values = [tipo_gasto, fk_empaque];
    
    if (excludeId) {
      query += ` AND pk_tipo_gasto != $3`;
      values.push(excludeId);
    }

    const { rows } = await pool.query(query, values);
    return rows.length > 0;
  }
}

module.exports = TipoGasto;