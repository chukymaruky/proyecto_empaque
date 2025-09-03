const Pedido = require('../../models/Pedido');
const Proveedor = require('../../models/proveedor');
const CategoriaProducto = require('../../models/CategoriaProducto');
const Transporte = require('../../models/Transporte');

const pedidoController = {
  showAddForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id, rol } = req.session.user;
      let proveedores, categorias, transportes;

      // Si es administrador, obtener todos los registros
      if (rol === 'administrador') {
        proveedores = await Proveedor.getAll();
        categorias = await CategoriaProducto.getAllWithEmpaque();
        transportes = await Transporte.getAll();
      } else {
        // Si no es administrador, solo obtener los registros de su empaque
        proveedores = await Proveedor.getAllByEmpaque(empaque_id);
        categorias = await CategoriaProducto.getAllByEmpaque(empaque_id);
        transportes = await Transporte.getAllByEmpaque(empaque_id);
      }

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
      let pedidos;
      let empaques = [];
      
      // Si es administrador, obtener todos los empaques
      if (req.session.user.rol === 'administrador') {
        const Empaque = require('../../models/empaque');
        empaques = await Empaque.getAllActive();
        
        // Si hay un filtro de empaque, usarlo
        if (req.query.empaque) {
          pedidos = await Pedido.getAllByEmpaque(req.query.empaque);
        } else {
          pedidos = await Pedido.getAll(); // Necesitaremos crear este método
        }
      } else {
        // Si no es admin, solo obtener los pedidos de su empaque
        pedidos = await Pedido.getAllByEmpaque(empaque_id);
      }

      res.render('admin/pedidos/list', {
        user: req.session.user,
        pedidos,
        empaques,
        selectedEmpaque: req.query.empaque || '',
        searchQuery: req.query.search || '',
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
    const { empaque_id, rol } = req.session.user;
    
    // Para admin, no verificar empaque
    const pedido = await Pedido.getById(id, rol === 'administrador' ? null : empaque_id);
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
},

  // Nuevo endpoint para obtener pedidos por empaque
  getPedidosByEmpaque: async (req, res) => {
    try {
      const { empaqueId } = req.params;
      
      // Verificar que el usuario tenga acceso a este empaque
      if (req.session.user.rol !== 'administrador' && req.session.user.empaque_id !== empaqueId) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      const pedidos = await Pedido.getAllByEmpaque(empaqueId);
      res.json(pedidos);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      res.status(500).json({ error: 'Error al obtener pedidos' });
    }
  },

  showEditForm: async (req, res) => {
  try {
    const { id } = req.params;
    const { empaque_id, rol } = req.session.user;
    
    // Obtener el pedido (sin verificar empaque para admin)
    const pedido = await Pedido.getById(id, rol === 'administrador' ? null : empaque_id);
    if (!pedido) {
      req.flash('error_msg', 'Pedido no encontrado');
      return res.redirect('/admin/pedidos');
    }

    // Para admin, obtener todos los registros, de lo contrario solo del empaque
    const proveedores = rol === 'administrador' 
      ? await Proveedor.getAll() 
      : await Proveedor.getAllByEmpaque(empaque_id);
      
    const categorias = rol === 'administrador' 
      ? await CategoriaProducto.getAllWithEmpaque() 
      : await CategoriaProducto.getAllByEmpaque(empaque_id);
      
    const transportes = rol === 'administrador' 
      ? await Transporte.getAll() 
      : await Transporte.getAllByEmpaque(empaque_id);

    res.render('admin/pedidos/edit', {
      user: req.session.user,
      pedido,
      proveedores,
      categorias,
      transportes,
      error_msg: req.flash('error_msg'),
      success_msg: req.flash('success_msg')
    });
  } catch (error) {
    console.error('Error al cargar formulario de edición:', error);
    req.flash('error_msg', 'Error al cargar el formulario de edición');
    res.redirect('/admin/pedidos');
  }
},

updatePedido: async (req, res) => {
  const { id } = req.params;
  const { 
    proveedor_id: fk_proveedor, 
    categoria_id: fk_categoria_producto, 
    transporte_id: fk_transporte, 
    peso: peso_pedido, 
    fecha_llegada, 
    hora_llegada,
    estado,
    observaciones 
  } = req.body;
  
  try {
    const { empaque_id, rol } = req.session.user;
    
    // Validar que el pedido exista (sin verificar empaque para admin)
    const pedido = await Pedido.getById(id, rol === 'administrador' ? null : empaque_id);
    if (!pedido) {
      req.flash('error_msg', 'Pedido no encontrado');
      return res.redirect('/admin/pedidos');
    }

    // Resto del código permanece igual...
    const dia_hora_llegada = `${fecha_llegada} ${hora_llegada}`;

    await Pedido.update(id, {
      fk_proveedor,
      fk_categoria_producto,
      fk_transporte: fk_transporte || null,
      peso_pedido: parseFloat(peso_pedido),
      dia_hora_llegada,
      estado_pedido: estado === 'true',
      observaciones: observaciones || null
    });

    req.flash('success_msg', 'Pedido actualizado exitosamente');
    res.redirect('/admin/pedidos');
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    req.flash('error_msg', 'Error al actualizar el pedido');
    res.redirect(`/admin/pedidos/edit/${id}`);
  }
}
};
module.exports = pedidoController;