const pool = require('../config/database');

class VentaProducto {
  static async create({ cantidad_producto, precio, fk_producto_procesado, fk_tipo_unidad, fk_empaque }) {
    const query = `
      INSERT INTO venta_producto 
      (cantidad_producto, precio, fk_producto_procesado, fk_tipo_unidad, fk_empaque) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [cantidad_producto, precio, fk_producto_procesado, fk_tipo_unidad, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT v.*, 
             pp.pk_producto_procesado,
             cp.nombre_categoria AS producto,
             tu.nombre_tipo_unidad,
             c.nombres || ' ' || c.primer_apellido AS cliente_nombre,
             e.nombre_empaque,
             (v.cantidad_producto * v.precio) AS total
      FROM venta_producto v
      JOIN producto_procesado pp ON v.fk_producto_procesado = pp.pk_producto_procesado
      JOIN categoria_producto cp ON pp.fk_categoria_producto = cp.pk_categoria_producto
      JOIN tipo_unidad tu ON v.fk_tipo_unidad = tu.pk_tipo_unidad
      JOIN cliente c ON v.fk_cliente = c.pk_cliente
      JOIN empaque e ON v.fk_empaque = e.pk_empaque
      WHERE v.fk_empaque = $1 AND v.estado = true
      ORDER BY v.fecha DESC, v.hora DESC
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_venta_producto, fk_empaque) {
    const query = `
      SELECT v.*, 
             pp.pk_producto_procesado,
             cp.nombre_categoria AS producto,
             tu.nombre_tipo_unidad,
             c.nombres || ' ' || c.primer_apellido AS cliente_nombre
      FROM venta_producto v
      JOIN producto_procesado pp ON v.fk_producto_procesado = pp.pk_producto_procesado
      JOIN categoria_producto cp ON pp.fk_categoria_producto = cp.pk_categoria_producto
      JOIN tipo_unidad tu ON v.fk_tipo_unidad = tu.pk_tipo_unidad
      JOIN cliente c ON v.fk_cliente = c.pk_cliente
      WHERE v.pk_venta_producto = $1 AND v.fk_empaque = $2 AND v.estado = true
    `;
    const { rows } = await pool.query(query, [pk_venta_producto, fk_empaque]);
    return rows[0];
  }

  static async getProductosProcesadosByEmpaque(fk_empaque) {
    const query = `
      SELECT pp.*, cp.nombre_categoria
      FROM producto_procesado pp
      JOIN categoria_producto cp ON pp.fk_categoria_producto = cp.pk_categoria_producto
      WHERE pp.fk_empaque = $1 AND pp.estado = true
      ORDER BY cp.nombre_categoria
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getTiposUnidadByEmpaque(fk_empaque) {
    const query = `
      SELECT * FROM tipo_unidad 
      WHERE fk_empaque = $1 AND estado = true
      ORDER BY nombre_tipo_unidad
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getClientesByEmpaque(fk_empaque) {
    const query = `
      SELECT c.*, e.razon_social, e.nombre_comercial
      FROM cliente c
      JOIN empresa e ON c.fk_empresa = e.pk_empresa
      WHERE c.fk_empaque = $1 AND c.estado = true
      ORDER BY e.razon_social
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }
}

module.exports = VentaProducto;