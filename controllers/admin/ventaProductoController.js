const VentaProducto = require('../../models/ventaProducto');
const ProductoProcesado = require('../../models/ProductoProcesado');
const TipoUnidad = require('../../models/TipoUnidad');
const Cliente = require('../../models/Cliente');

const ventaProductoController = {
  showAddForm: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      
      const productos = await VentaProducto.getProductosProcesadosByEmpaque(empaque_id);
      const tiposUnidad = await VentaProducto.getTiposUnidadByEmpaque(empaque_id);
      const clientes = await VentaProducto.getClientesByEmpaque(empaque_id);

      res.render('admin/ventas-productos/add', {
        user: req.session.user,
        productos,
        tiposUnidad,
        clientes,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/ventas-productos');
    }
  },

  addVentaProducto: async (req, res) => {
    const { 
      producto_id, 
      tipo_unidad_id, 
      cliente_id,
      cantidad, 
      precio 
    } = req.body;
    
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!producto_id || !tipo_unidad_id || !cliente_id || !cantidad || !precio) {
        req.flash('error_msg', 'Complete todos los campos obligatorios');
        return res.redirect('/admin/ventas-productos/add');
      }

      // Validar que cantidad y precio sean números positivos
      const cantidadNum = parseFloat(cantidad);
      const precioNum = parseFloat(precio);
      
      if (isNaN(cantidadNum) || cantidadNum <= 0) {
        req.flash('error_msg', 'La cantidad debe ser un número positivo');
        return res.redirect('/admin/ventas-productos/add');
      }

      if (isNaN(precioNum) || precioNum <= 0) {
        req.flash('error_msg', 'El precio debe ser un número positivo');
        return res.redirect('/admin/ventas-productos/add');
      }

      // Crear venta de producto
      await VentaProducto.create({
        cantidad_producto: cantidadNum,
        precio: precioNum,
        fk_producto_procesado: producto_id,
        fk_tipo_unidad: tipo_unidad_id,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Venta de producto registrada exitosamente');
      res.redirect('/admin/ventas-productos');
    } catch (error) {
      console.error('Error al crear venta de producto:', error);
      req.flash('error_msg', 'Error al registrar la venta de producto');
      res.redirect('/admin/ventas-productos/add');
    }
  },

  listVentasProducto: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const ventas = await VentaProducto.getAllByEmpaque(empaque_id);

      res.render('admin/ventas-productos/list', {
        user: req.session.user,
        ventas,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar ventas de producto:', error);
      req.flash('error_msg', 'Error al cargar las ventas de producto');
      res.redirect('/admin');
    }
  }
};

module.exports = ventaProductoController;