const pool = require('../config/database');

class Pedido {
  static async create({ fk_proveedor, fk_categoria_producto, fk_transporte, fk_empaque, peso_pedido, dia_hora_llegada, estado_pedido, observaciones }) {
    const query = `
      INSERT INTO pedido 
      (fk_proveedor, fk_categoria_producto, fk_transporte, fk_empaque, peso_pedido, dia_hora_llegada, estado_pedido, observaciones) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    const values = [fk_proveedor, fk_categoria_producto, fk_transporte, fk_empaque, peso_pedido, dia_hora_llegada, estado_pedido, observaciones];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT p.*, 
             pr.nombre_comercial as proveedor_nombre,
             cp.nombre_categoria as categoria_nombre,
             t.numero_placa as transporte_placa
      FROM pedido p
      LEFT JOIN proveedor pr ON p.fk_proveedor = pr.pk_proveedor
      LEFT JOIN categoria_producto cp ON p.fk_categoria_producto = cp.pk_categoria_producto
      LEFT JOIN transporte t ON p.fk_transporte = t.pk_transporte
      WHERE p.fk_empaque = $1
      ORDER BY p.dia_hora_llegada DESC
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_pedido, fk_empaque) {
    const query = `
      SELECT p.*, 
             pr.nombre_comercial as proveedor_nombre,
             cp.nombre_categoria as categoria_nombre,
             t.numero_placa as transporte_placa
      FROM pedido p
      LEFT JOIN proveedor pr ON p.fk_proveedor = pr.pk_proveedor
      LEFT JOIN categoria_producto cp ON p.fk_categoria_producto = cp.pk_categoria_producto
      LEFT JOIN transporte t ON p.fk_transporte = t.pk_transporte
      WHERE p.pk_pedido = $1 AND p.fk_empaque = $2
    `;
    const { rows } = await pool.query(query, [pk_pedido, fk_empaque]);
    return rows[0];
  }
}

module.exports = Pedido;