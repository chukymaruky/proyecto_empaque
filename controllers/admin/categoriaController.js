const CategoriaProducto = require('../../models/categoriaProducto');
const Empaque = require('../../models/empaque');

const categoriaController = {
   showAddForm: async (req, res) => {
    try {
      const empaques = await Empaque.getAllActive(); // Obtener los empaques
      
      res.render('admin/categorias/add', {
        user: req.session.user,
        empaques: empaques, // Pasar los empaques a la vista
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error('Error al cargar formulario:', error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/categorias');
    }
  },

  addCategoria: async (req, res) => {
    const { nombre_categoria, fk_empaque } = req.body;
    const { empaque_id } = req.session.user; // Empaque del usuario logueado (opcional para validación)

    try {
      // Validaciones básicas
      if (!nombre_categoria || !fk_empaque) {
        req.flash('error_msg', 'Todos los campos son obligatorios');
        return res.render('admin/categorias/add', {
          user: req.session.user,
          empaques: await Empaque.getAllActive(),
          formData: req.body,
          error_msg: req.flash('error_msg')
        });
      }

      // Validar nombre único para el empaque seleccionado
      const isAvailable = await CategoriaProducto.isNameAvailable(nombre_categoria, fk_empaque);
      if (!isAvailable) {
        req.flash('error_msg', 'Ya existe una categoría con ese nombre en el empaque seleccionado');
        return res.render('admin/categorias/add', {
          user: req.session.user,
          empaques: await Empaque.getAllActive(),
          formData: req.body,
          error_msg: req.flash('error_msg')
        });
      }

      // Crear categoría
      await CategoriaProducto.create({
        nombre_categoria,
        fk_empaque
      });

      req.flash('success_msg', 'Categoría creada exitosamente');
      res.redirect('/admin/categorias');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      req.flash('error_msg', 'Error al crear la categoría');
      res.redirect('/admin/categorias/add');
    }
  },

 listCategorias: async (req, res) => {
    try {
      // Obtener todas las categorías con información del empaque
      const categorias = await CategoriaProducto.getAllWithEmpaque();
      
      // Obtener lista de empaques para el filtro
      const empaques = await Empaque.getAllActive();

      res.render('admin/categorias/list', {
        user: req.session.user,
        categorias,
        empaques, // Esta es la variable que necesitas pasar
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar categorías:', error);
      req.flash('error_msg', 'Error al cargar las categorías');
      res.redirect('/admin');
    }
  }};

module.exports = categoriaController;