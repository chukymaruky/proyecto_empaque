const pool = require('../config/database');

class Transporte {
  static async create({ numero_placa, color, marca, numero_oficial, fk_tipo_vehiculo, fk_empresa, fk_empaque }) {
    const query = `
      INSERT INTO transporte 
      (numero_placa, color, marca, numero_oficial, fk_tipo_vehiculo, fk_empresa, fk_empaque) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    const values = [numero_placa, color, marca, numero_oficial || null, fk_tipo_vehiculo, fk_empresa || null, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT t.*, 
             tv.tipo_vehiculo,
             e.nombre_comercial as empresa_nombre,
             emp.nombre_empaque
      FROM transporte t
      JOIN tipo_vehiculo tv ON t.fk_tipo_vehiculo = tv.pk_tipo_vehiculo
      LEFT JOIN empresa e ON t.fk_empresa = e.pk_empresa
      JOIN empaque emp ON t.fk_empaque = emp.pk_empaque
      WHERE t.fk_empaque = $1 AND t.estado = true
      ORDER BY t.numero_placa
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_transporte, fk_empaque) {
    const query = `
      SELECT t.*, 
             tv.tipo_vehiculo,
             e.nombre_comercial as empresa_nombre
      FROM transporte t
      JOIN tipo_vehiculo tv ON t.fk_tipo_vehiculo = tv.pk_tipo_vehiculo
      LEFT JOIN empresa e ON t.fk_empresa = e.pk_empresa
      WHERE t.pk_transporte = $1 AND t.fk_empaque = $2 AND t.estado = true
    `;
    const { rows } = await pool.query(query, [pk_transporte, fk_empaque]);
    return rows[0];
  }

  static async update({ pk_transporte, numero_placa, color, marca, numero_oficial, fk_tipo_vehiculo, fk_empresa, fk_empaque }) {
    const query = `
      UPDATE transporte 
      SET numero_placa = $1,
          color = $2,
          marca = $3,
          numero_oficial = $4,
          fk_tipo_vehiculo = $5,
          fk_empresa = $6
      WHERE pk_transporte = $7 AND fk_empaque = $8
      RETURNING *
    `;
    const values = [numero_placa, color, marca, numero_oficial || null, fk_tipo_vehiculo, fk_empresa || null, pk_transporte, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(pk_transporte, fk_empaque) {
    const query = `
      UPDATE transporte 
      SET estado = false
      WHERE pk_transporte = $1 AND fk_empaque = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [pk_transporte, fk_empaque]);
    return rows[0];
  }

  static async getTiposVehiculoByEmpaque(fk_empaque) {
    const query = `
      SELECT * FROM tipo_vehiculo 
      WHERE fk_empaque = $1 AND estado = true
      ORDER BY tipo_vehiculo
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getEmpresasByEmpaque(fk_empaque) {
    const query = `
      SELECT * FROM empresa 
      WHERE fk_empaque = $1 AND estado = true
      ORDER BY nombre_comercial
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async isPlacaExists(numero_placa, fk_empaque, excludeId = null) {
    let query = `
      SELECT 1 FROM transporte 
      WHERE numero_placa = $1 AND fk_empaque = $2 AND estado = true
    `;
    const values = [numero_placa, fk_empaque];
    
    if (excludeId) {
      query += ` AND pk_transporte != $3`;
      values.push(excludeId);
    }

    const { rows } = await pool.query(query, values);
    return rows.length > 0;
  }
}

module.exports = Transporte;