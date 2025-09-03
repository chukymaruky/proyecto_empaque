//models/Pedido.js

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

  static async getAll() {
    const query = `
      SELECT p.*, 
             COALESCE(e.nombre_comercial, e.razon_social) as proveedor_nombre,
             cp.nombre_categoria as categoria_nombre,
             t.numero_placa as transporte_placa,
             em.nombre_empaque
      FROM pedido p
      LEFT JOIN proveedor pr ON p.fk_proveedor = pr.pk_proveedor
      LEFT JOIN empresa e ON pr.fk_empresa = e.pk_empresa
      LEFT JOIN categoria_producto cp ON p.fk_categoria_producto = cp.pk_categoria_producto
      LEFT JOIN transporte t ON p.fk_transporte = t.pk_transporte
      LEFT JOIN empaque em ON p.fk_empaque = em.pk_empaque
      ORDER BY p.dia_hora_llegada DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT p.*, 
             COALESCE(e.nombre_comercial, e.razon_social) as proveedor_nombre,
             cp.nombre_categoria as categoria_nombre,
             t.numero_placa as transporte_placa,
             em.nombre_empaque
      FROM pedido p
      LEFT JOIN proveedor pr ON p.fk_proveedor = pr.pk_proveedor
      LEFT JOIN empresa e ON pr.fk_empresa = e.pk_empresa
      LEFT JOIN categoria_producto cp ON p.fk_categoria_producto = cp.pk_categoria_producto
      LEFT JOIN transporte t ON p.fk_transporte = t.pk_transporte
      LEFT JOIN empaque em ON p.fk_empaque = em.pk_empaque
      WHERE p.fk_empaque = $1
      ORDER BY p.dia_hora_llegada DESC
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_pedido, fk_empaque = null) {
  let query = `
    SELECT p.*, 
           COALESCE(e.nombre_comercial, e.razon_social) as proveedor_nombre,
           cp.nombre_categoria as categoria_nombre,
           t.numero_placa as transporte_placa
    FROM pedido p
    LEFT JOIN proveedor pr ON p.fk_proveedor = pr.pk_proveedor
    LEFT JOIN empresa e ON pr.fk_empresa = e.pk_empresa
    LEFT JOIN categoria_producto cp ON p.fk_categoria_producto = cp.pk_categoria_producto
    LEFT JOIN transporte t ON p.fk_transporte = t.pk_transporte
    WHERE p.pk_pedido = $1
  `;
  
  const values = [pk_pedido];
  
  if (fk_empaque) {
    query += ` AND p.fk_empaque = $2`;
    values.push(fk_empaque);
  }
  
  const { rows } = await pool.query(query, values);
  return rows[0];
}

  static async update(pk_pedido, { fk_proveedor, fk_categoria_producto, fk_transporte, peso_pedido, dia_hora_llegada, estado_pedido, observaciones }) {
    const query = `
      UPDATE pedido 
      SET fk_proveedor = $1,
          fk_categoria_producto = $2,
          fk_transporte = $3,
          peso_pedido = $4,
          dia_hora_llegada = $5,
          estado_pedido = $6,
          observaciones = $7,
          hora = CURRENT_TIME,
          fecha = CURRENT_DATE
      WHERE pk_pedido = $8
      RETURNING *
    `;
    const values = [
      fk_proveedor,
      fk_categoria_producto,
      fk_transporte,
      peso_pedido,
      dia_hora_llegada,
      estado_pedido,
      observaciones,
      pk_pedido
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

module.exports = Pedido;