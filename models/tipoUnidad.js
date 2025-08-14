const pool = require('../config/database');

class TipoUnidad {
  static async create({ nombre_tipo_unidad, fk_empaque }) {
    const query = `
      INSERT INTO tipo_unidad 
      (nombre_tipo_unidad, fk_empaque) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    const values = [nombre_tipo_unidad, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT tu.*, e.nombre_empaque
      FROM tipo_unidad tu
      JOIN empaque e ON tu.fk_empaque = e.pk_empaque
      WHERE tu.fk_empaque = $1 AND tu.estado = true
      ORDER BY tu.nombre_tipo_unidad
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_tipo_unidad, fk_empaque) {
    const query = `
      SELECT * FROM tipo_unidad 
      WHERE pk_tipo_unidad = $1 AND fk_empaque = $2 AND estado = true
    `;
    const { rows } = await pool.query(query, [pk_tipo_unidad, fk_empaque]);
    return rows[0];
  }

  static async update({ pk_tipo_unidad, nombre_tipo_unidad, fk_empaque }) {
    const query = `
      UPDATE tipo_unidad 
      SET nombre_tipo_unidad = $1
      WHERE pk_tipo_unidad = $2 AND fk_empaque = $3
      RETURNING *
    `;
    const values = [nombre_tipo_unidad, pk_tipo_unidad, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(pk_tipo_unidad, fk_empaque) {
    const query = `
      UPDATE tipo_unidad 
      SET estado = false
      WHERE pk_tipo_unidad = $1 AND fk_empaque = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [pk_tipo_unidad, fk_empaque]);
    return rows[0];
  }

  static async isTipoUnidadExists(nombre_tipo_unidad, fk_empaque, excludeId = null) {
    let query = `
      SELECT 1 FROM tipo_unidad 
      WHERE nombre_tipo_unidad = $1 AND fk_empaque = $2 AND estado = true
    `;
    const values = [nombre_tipo_unidad, fk_empaque];
    
    if (excludeId) {
      query += ` AND pk_tipo_unidad != $3`;
      values.push(excludeId);
    }

    const { rows } = await pool.query(query, values);
    return rows.length > 0;
  }
}

module.exports = TipoUnidad;