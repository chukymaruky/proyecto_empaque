const Pedido = require('../../models/Pedido');
const Proveedor = require('../../models/proveedor');
const CategoriaProducto = require('../../models/CategoriaProducto');
const Transporte = require('../../models/Transporte');

const pedidoController = {
  showAddForm: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      
      const proveedores = await Proveedor.getAllByEmpaque(empaque_id);
      const categorias = await CategoriaProducto.getAllByEmpaque(empaque_id);
      const transportes = await Transporte.getAllByEmpaque(empaque_id);

      res.render('admin/pedidos/add', {
        user: req.session.user,
        proveedores,
        categorias,
        transportes,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/pedidos');
    }
  },

  addPedido: async (req, res) => {
    const { 
      proveedor_id, 
      categoria_id, 
      transporte_id, 
      peso, 
      fecha_llegada, 
      hora_llegada,
      estado,
      observaciones 
    } = req.body;
    
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!proveedor_id || !categoria_id || !peso || !fecha_llegada || !hora_llegada) {
        req.flash('error_msg', 'Complete todos los campos obligatorios');
        return res.redirect('/admin/pedidos/add');
      }

      const dia_hora_llegada = `${fecha_llegada} ${hora_llegada}`;

      // Crear pedido
      await Pedido.create({
        fk_proveedor: proveedor_id,
        fk_categoria_producto: categoria_id,
        fk_transporte: transporte_id || null,
        fk_empaque: empaque_id,
        peso_pedido: parseFloat(peso),
        dia_hora_llegada,
        estado_pedido: estado === 'true',
        observaciones: observaciones || null
      });

      req.flash('success_msg', 'Pedido registrado exitosamente');
      res.redirect('/admin/pedidos');
    } catch (error) {
      console.error('Error al crear pedido:', error);
      req.flash('error_msg', 'Error al registrar el pedido');
      res.redirect('/admin/pedidos/add');
    }
  },

  listPedidos: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const pedidos = await Pedido.getAllByEmpaque(empaque_id);

      res.render('admin/pedidos/list', {
        user: req.session.user,
        pedidos,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar pedidos:', error);
      req.flash('error_msg', 'Error al cargar los pedidos');
      res.redirect('/admin');
    }
  },

  viewPedido: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id } = req.session.user;
      
      const pedido = await Pedido.getById(id, empaque_id);
      if (!pedido) {
        req.flash('error_msg', 'Pedido no encontrado');
        return res.redirect('/admin/pedidos');
      }

      res.render('admin/pedidos/view', {
        user: req.session.user,
        pedido,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al ver pedido:', error);
      req.flash('error_msg', 'Error al cargar el pedido');
      res.redirect('/admin/pedidos');
    }
  }
};

module.exports = pedidoController;