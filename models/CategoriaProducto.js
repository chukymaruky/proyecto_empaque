const pool = require('../config/database');

class CategoriaProducto {
  static async create({ nombre_categoria, fk_empaque }) {
    const query = `
      INSERT INTO categoria_producto 
      (nombre_categoria, fk_empaque) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    const values = [nombre_categoria, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT * FROM categoria_producto 
      WHERE fk_empaque = $1
      ORDER BY nombre_categoria
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async isNameAvailable(nombre_categoria, fk_empaque) {
    const query = `
      SELECT 1 FROM categoria_producto 
      WHERE nombre_categoria = $1 AND fk_empaque = $2
    `;
    const { rows } = await pool.query(query, [nombre_categoria, fk_empaque]);
    return rows.length === 0;
  }


static async getAllWithEmpaque() {
    const query = `
      SELECT cp.*, e.nombre_empaque 
      FROM categoria_producto cp
      JOIN empaque e ON cp.fk_empaque = e.pk_empaque
      ORDER BY e.nombre_empaque, cp.nombre_categoria
    `;
    const { rows } = await pool.query(query);
    return rows;
  }
}

class Empaque {
  static async getAllActive() {
    const query = `
      SELECT * FROM empaque 
      WHERE estado = true
      ORDER BY nombre_empaque
    `;
    const { rows } = await pool.query(query);
    return rows;
  }
}

module.exports = CategoriaProducto;