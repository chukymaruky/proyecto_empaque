const pool = require('../config/database');

class DatoPersona {
  // Crear un nuevo dato personal
  static async create({ nombres, primer_apellido, segundo_apellido, fk_empaque }) {
    const query = `
      INSERT INTO dato_persona 
      (nombres, primer_apellido, segundo_apellido, fk_empaque) 
      VALUES ($1, $2, $3, $4) 
      RETURNING pk_dato_persona
    `;
    const values = [nombres, primer_apellido, segundo_apellido, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

module.exports = DatoPersona;