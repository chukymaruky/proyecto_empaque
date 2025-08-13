const ProductoProcesado = require('../../models/ProductoProcesado');
const Pedido = require('../../models/Pedido');
const CategoriaProducto = require('../../models/CategoriaProducto');
const TipoUnidad = require('../../models/TipoUnidad');

const productoProcesadoController = {
  showAddForm: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      
      const pedidos = await Pedido.getAllByEmpaque(empaque_id);
      const categorias = await CategoriaProducto.getAllByEmpaque(empaque_id);
      const tiposUnidad = await TipoUnidad.getAllByEmpaque(empaque_id);

      res.render('admin/productos-procesados/add', {
        user: req.session.user,
        pedidos,
        categorias,
        tiposUnidad,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/productos-procesados');
    }
  },

  addProductoProcesado: async (req, res) => {
    const { 
      pedido_id, 
      categoria_id, 
      tipo_unidad_id 
    } = req.body;
    
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!pedido_id || !categoria_id || !tipo_unidad_id) {
        req.flash('error_msg', 'Complete todos los campos obligatorios');
        return res.redirect('/admin/productos-procesados/add');
      }

      // Crear producto procesado
      await ProductoProcesado.create({
        fk_categoria_producto: categoria_id,
        fk_pedido: pedido_id,
        fk_empaque: empaque_id,
        fk_tipo_unidad: tipo_unidad_id
      });

      req.flash('success_msg', 'Producto procesado registrado exitosamente');
      res.redirect('/admin/productos-procesados');
    } catch (error) {
      console.error('Error al crear producto procesado:', error);
      req.flash('error_msg', 'Error al registrar el producto procesado');
      res.redirect('/admin/productos-procesados/add');
    }
  },

  showEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id } = req.session.user;
      
      const producto = await ProductoProcesado.getById(id, empaque_id);
      if (!producto) {
        req.flash('error_msg', 'Producto procesado no encontrado');
        return res.redirect('/admin/productos-procesados');
      }

      const pedidos = await Pedido.getAllByEmpaque(empaque_id);
      const categorias = await CategoriaProducto.getAllByEmpaque(empaque_id);
      const tiposUnidad = await TipoUnidad.getAllByEmpaque(empaque_id);

      res.render('admin/productos-procesados/edit', {
        user: req.session.user,
        producto,
        pedidos,
        categorias,
        tiposUnidad,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      req.flash('error_msg', 'Error al cargar el formulario de edición');
      res.redirect('/admin/productos-procesados');
    }
  },

  updateProductoProcesado: async (req, res) => {
    const { id } = req.params;
    const { 
      pedido_id, 
      categoria_id, 
      tipo_unidad_id 
    } = req.body;
    
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!pedido_id || !categoria_id || !tipo_unidad_id) {
        req.flash('error_msg', 'Complete todos los campos obligatorios');
        return res.redirect(`/admin/productos-procesados/edit/${id}`);
      }

      // Actualizar producto procesado
      const query = `
        UPDATE producto_procesado 
        SET fk_categoria_producto = $1,
            fk_pedido = $2,
            fk_tipo_unidad = $3
        WHERE pk_producto_procesado = $4 AND fk_empaque = $5
        RETURNING *
      `;
      const values = [categoria_id, pedido_id, tipo_unidad_id, id, empaque_id];
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        req.flash('error_msg', 'Producto no encontrado o no tienes permiso');
        return res.redirect('/admin/productos-procesados');
      }

      req.flash('success_msg', 'Producto procesado actualizado exitosamente');
      res.redirect('/admin/productos-procesados');
    } catch (error) {
      console.error('Error al actualizar producto procesado:', error);
      req.flash('error_msg', 'Error al actualizar el producto procesado');
      res.redirect(`/admin/productos-procesados/edit/${id}`);
    }
  },

  deleteProductoProcesado: async (req, res) => {
    const { id } = req.params;
    const { empaque_id } = req.session.user;

    try {
      // Eliminar producto procesado (cambio de estado)
      const query = `
        UPDATE producto_procesado 
        SET estado = false
        WHERE pk_producto_procesado = $1 AND fk_empaque = $2
        RETURNING *
      `;
      const { rows } = await pool.query(query, [id, empaque_id]);

      if (rows.length === 0) {
        req.flash('error_msg', 'Producto no encontrado o no tienes permiso');
      } else {
        req.flash('success_msg', 'Producto procesado eliminado exitosamente');
      }
      
      res.redirect('/admin/productos-procesados');
    } catch (error) {
      console.error('Error al eliminar producto procesado:', error);
      req.flash('error_msg', 'Error al eliminar el producto procesado');
      res.redirect('/admin/productos-procesados');
    }
  },

  listProductosProcesados: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const productos = await ProductoProcesado.getAllByEmpaque(empaque_id);

      res.render('admin/productos-procesados/list', {
        user: req.session.user,
        productos,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar productos procesados:', error);
      req.flash('error_msg', 'Error al cargar los productos procesados');
      res.redirect('/admin');
    }
  }
};

module.exports = productoProcesadoController;