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

static async update(pk_empresa, { 
  razon_social, 
  nombre_comercial, 
  rfc, 
  regimen_fiscal, 
  domicilio_fiscal, 
  telefono_contacto, 
  email_contacto, 
  representante_legal,
  fk_empaque 
}) {
  const query = `
    UPDATE empresa 
    SET razon_social = $1,
        nombre_comercial = $2,
        rfc = $3,
        regimen_fiscal = $4,
        domicilio_fiscal = $5,
        telefono_contacto = $6,
        email_contacto = $7,
        representante_legal = $8,
        fk_empaque = $9
    WHERE pk_empresa = $10
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
    fk_empaque,
    pk_empresa
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

}



module.exports = Empresa;