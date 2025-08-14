const pool = require('../config/database');

class Transportista {
  static async create({ fk_dato_persona, fk_empresa, fk_empaque }) {
    const query = `
      INSERT INTO transportista 
      (fk_dato_persona, fk_empresa, fk_empaque) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [fk_dato_persona, fk_empresa || null, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT t.*, 
             dp.nombres || ' ' || dp.primer_apellido AS nombre_completo,
             dp.primer_apellido,
             dp.segundo_apellido,
             e.nombre_comercial AS empresa_nombre,
             emp.nombre_empaque
      FROM transportista t
      JOIN dato_persona dp ON t.fk_dato_persona = dp.pk_dato_persona
      LEFT JOIN empresa e ON t.fk_empresa = e.pk_empresa
      JOIN empaque emp ON t.fk_empaque = emp.pk_empaque
      WHERE t.fk_empaque = $1 AND t.estado = true
      ORDER BY dp.nombres
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_transportista, fk_empaque) {
    const query = `
      SELECT t.*, 
             dp.nombres || ' ' || dp.primer_apellido AS nombre_completo,
             dp.nombres,
             dp.primer_apellido,
             dp.segundo_apellido,
             e.nombre_comercial AS empresa_nombre
      FROM transportista t
      JOIN dato_persona dp ON t.fk_dato_persona = dp.pk_dato_persona
      LEFT JOIN empresa e ON t.fk_empresa = e.pk_empresa
      WHERE t.pk_transportista = $1 AND t.fk_empaque = $2 AND t.estado = true
    `;
    const { rows } = await pool.query(query, [pk_transportista, fk_empaque]);
    return rows[0];
  }

  static async update({ pk_transportista, fk_empresa, fk_empaque }) {
    const query = `
      UPDATE transportista 
      SET fk_empresa = $1
      WHERE pk_transportista = $2 AND fk_empaque = $3
      RETURNING *
    `;
    const values = [fk_empresa || null, pk_transportista, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(pk_transportista, fk_empaque) {
    const query = `
      UPDATE transportista 
      SET estado = false
      WHERE pk_transportista = $1 AND fk_empaque = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [pk_transportista, fk_empaque]);
    return rows[0];
  }

  static async getPersonasDisponibles(fk_empaque) {
    const query = `
      SELECT dp.* 
      FROM dato_persona dp
      LEFT JOIN transportista t ON dp.pk_dato_persona = t.fk_dato_persona AND t.estado = true
      LEFT JOIN usuario u ON dp.pk_dato_persona = u.fk_dato_persona AND u.estado = true
      WHERE dp.fk_empaque = $1 AND dp.estado = true
      AND t.pk_transportista IS NULL
      AND u.pk_usuario IS NULL
      ORDER BY dp.nombres
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

  static async isPersonaTransportista(fk_dato_persona) {
    const query = `
      SELECT 1 FROM transportista 
      WHERE fk_dato_persona = $1 AND estado = true
    `;
    const { rows } = await pool.query(query, [fk_dato_persona]);
    return rows.length > 0;
  }
}

module.exports = Transportista;