const pool = require('../config/database');

class ProductoProcesado {
  static async create({ fk_categoria_producto, fk_pedido, fk_empaque, fk_tipo_unidad }) {
    const query = `
      INSERT INTO producto_procesado 
      (fk_categoria_producto, fk_pedido, fk_empaque, fk_tipo_unidad) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [fk_categoria_producto, fk_pedido, fk_empaque, fk_tipo_unidad];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT pp.*, 
             cp.nombre_categoria,
             p.dia_hora_llegada as fecha_pedido,
             tu.nombre_tipo_unidad,
             pr.nombre_comercial as proveedor_nombre
      FROM producto_procesado pp
      JOIN categoria_producto cp ON pp.fk_categoria_producto = cp.pk_categoria_producto
      JOIN pedido p ON pp.fk_pedido = p.pk_pedido
      JOIN tipo_unidad tu ON pp.fk_tipo_unidad = tu.pk_tipo_unidad
      JOIN proveedor pr ON p.fk_proveedor = pr.pk_proveedor
      WHERE pp.fk_empaque = $1 AND pp.estado = true
      ORDER BY p.dia_hora_llegada DESC
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getById(pk_producto_procesado, fk_empaque) {
    const query = `
      SELECT pp.*, 
             cp.nombre_categoria,
             p.dia_hora_llegada as fecha_pedido,
             tu.nombre_tipo_unidad,
             pr.nombre_comercial as proveedor_nombre
      FROM producto_procesado pp
      JOIN categoria_producto cp ON pp.fk_categoria_producto = cp.pk_categoria_producto
      JOIN pedido p ON pp.fk_pedido = p.pk_pedido
      JOIN tipo_unidad tu ON pp.fk_tipo_unidad = tu.pk_tipo_unidad
      JOIN proveedor pr ON p.fk_proveedor = pr.pk_proveedor
      WHERE pp.pk_producto_procesado = $1 AND pp.fk_empaque = $2 AND pp.estado = true
    `;
    const { rows } = await pool.query(query, [pk_producto_procesado, fk_empaque]);
    return rows[0];
  }

  static async update({ pk_producto_procesado, fk_categoria_producto, fk_pedido, fk_tipo_unidad, fk_empaque }) {
    const query = `
      UPDATE producto_procesado 
      SET fk_categoria_producto = $1,
          fk_pedido = $2,
          fk_tipo_unidad = $3
      WHERE pk_producto_procesado = $4 AND fk_empaque = $5
      RETURNING *
    `;
    const values = [fk_categoria_producto, fk_pedido, fk_tipo_unidad, pk_producto_procesado, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(pk_producto_procesado, fk_empaque) {
    const query = `
      UPDATE producto_procesado 
      SET estado = false
      WHERE pk_producto_procesado = $1 AND fk_empaque = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [pk_producto_procesado, fk_empaque]);
    return rows[0];
  }
}

module.exports = ProductoProcesado;