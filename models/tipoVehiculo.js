const pool = require('../config/database');

class TipoVehiculo {
  static async create({ tipo_vehiculo, capacidad_carga_kg, fk_empaque }) {
    const query = `
      INSERT INTO tipo_vehiculo 
      (tipo_vehiculo, capacidad_carga_kg, fk_empaque) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [tipo_vehiculo, capacidad_carga_kg, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT tv.*, e.nombre_empaque
      FROM tipo_vehiculo tv
      JOIN empaque e ON tv.fk_empaque = e.pk_empaque
      WHERE tv.fk_empaque = $1 AND tv.estado = true
      ORDER BY tv.tipo_vehiculo
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_tipo_vehiculo, fk_empaque) {
    const query = `
      SELECT * FROM tipo_vehiculo 
      WHERE pk_tipo_vehiculo = $1 AND fk_empaque = $2 AND estado = true
    `;
    const { rows } = await pool.query(query, [pk_tipo_vehiculo, fk_empaque]);
    return rows[0];
  }

  static async update({ pk_tipo_vehiculo, tipo_vehiculo, capacidad_carga_kg, fk_empaque }) {
    const query = `
      UPDATE tipo_vehiculo 
      SET tipo_vehiculo = $1,
          capacidad_carga_kg = $2
      WHERE pk_tipo_vehiculo = $3 AND fk_empaque = $4
      RETURNING *
    `;
    const values = [tipo_vehiculo, capacidad_carga_kg, pk_tipo_vehiculo, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(pk_tipo_vehiculo, fk_empaque) {
    const query = `
      UPDATE tipo_vehiculo 
      SET estado = false
      WHERE pk_tipo_vehiculo = $1 AND fk_empaque = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [pk_tipo_vehiculo, fk_empaque]);
    return rows[0];
  }

  static async isTipoVehiculoExists(tipo_vehiculo, fk_empaque, excludeId = null) {
    let query = `
      SELECT 1 FROM tipo_vehiculo 
      WHERE tipo_vehiculo = $1 AND fk_empaque = $2 AND estado = true
    `;
    const values = [tipo_vehiculo, fk_empaque];
    
    if (excludeId) {
      query += ` AND pk_tipo_vehiculo != $3`;
      values.push(excludeId);
    }

    const { rows } = await pool.query(query, values);
    return rows.length > 0;
  }
}

module.exports = TipoVehiculo;