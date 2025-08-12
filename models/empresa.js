const pool = require('../config/database');

class Empresa {
  static async create({ razon_social, nombre_comercial, rfc, regimen_fiscal, domicilio_fiscal, telefono_contacto, email_contacto, representante_legal, fk_empaque }) {
    const query = `
      INSERT INTO empresa 
      (razon_social, nombre_comercial, rfc, regimen_fiscal, domicilio_fiscal, telefono_contacto, email_contacto, representante_legal, fk_empaque) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
    `;
    const values = [
      razon_social,
      nombre_comercial || null,
      rfc || null,
      regimen_fiscal || null,
      domicilio_fiscal || null,
      telefono_contacto || null,
      email_contacto || null,
      representante_legal || null,
      fk_empaque
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = 'SELECT * FROM empresa WHERE fk_empaque = $1 ORDER BY razon_social';
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getAll() {
    const query = 'SELECT * FROM empresa ORDER BY razon_social';
    const { rows } = await pool.query(query);
    return rows;
  }
}

module.exports = Empresa;