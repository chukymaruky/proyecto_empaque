const pool = require('../config/database');

class Gasto {
  static async create({ concepto, monto, fk_tipo_gasto, fk_pedido, fk_empaque }) {
    const query = `
      INSERT INTO gasto 
      (concepto, monto, fk_tipo_gasto, fk_pedido, fk_empaque) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [concepto, monto, fk_tipo_gasto, fk_pedido || null, fk_empaque];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAll() {
    const query = `
      SELECT g.*, tg.tipo_gasto, p.pk_pedido, e.nombre_empaque,
             COALESCE(dp.nombres || ' ' || dp.primer_apellido, emp.razon_social) as proveedor_nombre
      FROM gasto g
      LEFT JOIN tipo_gasto tg ON g.fk_tipo_gasto = tg.pk_tipo_gasto
      LEFT JOIN pedido p ON g.fk_pedido = p.pk_pedido
      LEFT JOIN empaque e ON g.fk_empaque = e.pk_empaque
      LEFT JOIN proveedor pr ON p.fk_proveedor = pr.pk_proveedor
      LEFT JOIN dato_persona dp ON pr.fk_dato_persona = dp.pk_dato_persona
      LEFT JOIN empresa emp ON pr.fk_empresa = emp.pk_empresa
      ORDER BY g.fecha DESC, g.hora DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getAllByEmpaque(fk_empaque) {
    const query = `
      SELECT g.*, tg.tipo_gasto, p.pk_pedido,
             COALESCE(dp.nombres || ' ' || dp.primer_apellido, emp.razon_social) as proveedor_nombre
      FROM gasto g
      LEFT JOIN tipo_gasto tg ON g.fk_tipo_gasto = tg.pk_tipo_gasto
      LEFT JOIN pedido p ON g.fk_pedido = p.pk_pedido
      LEFT JOIN proveedor pr ON p.fk_proveedor = pr.pk_proveedor
      LEFT JOIN dato_persona dp ON pr.fk_dato_persona = dp.pk_dato_persona
      LEFT JOIN empresa emp ON pr.fk_empresa = emp.pk_empresa
      WHERE g.fk_empaque = $1
      ORDER BY g.fecha DESC, g.hora DESC
    `;
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }

  static async getTiposGasto() {
    const query = 'SELECT * FROM tipo_gasto ORDER BY tipo_gasto';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getPedidosByEmpaque(fk_empaque) {
    const query = 'SELECT pk_pedido FROM pedido WHERE fk_empaque = $1 ORDER BY fecha DESC';
    const { rows } = await pool.query(query, [fk_empaque]);
    return rows;
  }
}

module.exports = Gasto;