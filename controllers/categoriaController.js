const CategoriaProducto = require('../../models/CategoriaProducto');

const categoriaController = {
  showAddForm: (req, res) => {
    res.render('admin/categorias/add', {
      user: req.session.user,
      error_msg: req.flash('error_msg'),
      success_msg: req.flash('success_msg'),
      formData: null
    });
  },

  addCategoria: async (req, res) => {
    const { nombre_categoria } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validar nombre único
      const isAvailable = await CategoriaProducto.isNameAvailable(nombre_categoria, empaque_id);
      if (!isAvailable) {
        req.flash('error_msg', 'Ya existe una categoría con ese nombre');
        return res.render('admin/categorias/add', {
          user: req.session.user,
          formData: req.body,
          error_msg: req.flash('error_msg')
        });
      }

      // Crear categoría
      await CategoriaProducto.create({
        nombre_categoria,
        fk_empaque: empaque_id
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
      const { empaque_id } = req.session.user;
      const categorias = await CategoriaProducto.getAllByEmpaque(empaque_id);

      res.render('admin/categorias/list', {
        user: req.session.user,
        categorias,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar categorías:', error);
      req.flash('error_msg', 'Error al cargar las categorías');
      res.redirect('/admin');
    }
  }
};

module.exports = categoriaController;