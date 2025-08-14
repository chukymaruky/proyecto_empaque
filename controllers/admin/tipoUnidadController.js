const TipoUnidad = require('../../models/TipoUnidad');

const tipoUnidadController = {
  showAddForm: async (req, res) => {
    try {
      res.render('admin/tipos-unidad/add', {
        user: req.session.user,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/tipos-unidad');
    }
  },

  addTipoUnidad: async (req, res) => {
    const { nombre_tipo_unidad } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!nombre_tipo_unidad) {
        req.flash('error_msg', 'El nombre del tipo de unidad es obligatorio');
        return res.redirect('/admin/tipos-unidad/add');
      }

      // Verificar si el tipo de unidad ya existe
      const tipoExists = await TipoUnidad.isTipoUnidadExists(nombre_tipo_unidad, empaque_id);
      if (tipoExists) {
        req.flash('error_msg', 'Este tipo de unidad ya está registrado');
        return res.redirect('/admin/tipos-unidad/add');
      }

      // Crear tipo de unidad
      await TipoUnidad.create({
        nombre_tipo_unidad,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Tipo de unidad registrado exitosamente');
      res.redirect('/admin/tipos-unidad');
    } catch (error) {
      console.error('Error al crear tipo de unidad:', error);
      req.flash('error_msg', 'Error al registrar el tipo de unidad');
      res.redirect('/admin/tipos-unidad/add');
    }
  },

  showEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id } = req.session.user;
      
      const tipoUnidad = await TipoUnidad.getById(id, empaque_id);
      if (!tipoUnidad) {
        req.flash('error_msg', 'Tipo de unidad no encontrado');
        return res.redirect('/admin/tipos-unidad');
      }

      res.render('admin/tipos-unidad/edit', {
        user: req.session.user,
        tipoUnidad,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      req.flash('error_msg', 'Error al cargar el formulario de edición');
      res.redirect('/admin/tipos-unidad');
    }
  },

  updateTipoUnidad: async (req, res) => {
    const { id } = req.params;
    const { nombre_tipo_unidad } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!nombre_tipo_unidad) {
        req.flash('error_msg', 'El nombre del tipo de unidad es obligatorio');
        return res.redirect(`/admin/tipos-unidad/edit/${id}`);
      }

      // Verificar si el tipo de unidad ya existe (excluyendo el actual)
      const tipoExists = await TipoUnidad.isTipoUnidadExists(nombre_tipo_unidad, empaque_id, id);
      if (tipoExists) {
        req.flash('error_msg', 'Este tipo de unidad ya está registrado');
        return res.redirect(`/admin/tipos-unidad/edit/${id}`);
      }

      // Actualizar tipo de unidad
      const updatedTipoUnidad = await TipoUnidad.update({
        pk_tipo_unidad: id,
        nombre_tipo_unidad,
        fk_empaque: empaque_id
      });

      if (!updatedTipoUnidad) {
        req.flash('error_msg', 'Tipo de unidad no encontrado o no tienes permiso');
        return res.redirect('/admin/tipos-unidad');
      }

      req.flash('success_msg', 'Tipo de unidad actualizado exitosamente');
      res.redirect('/admin/tipos-unidad');
    } catch (error) {
      console.error('Error al actualizar tipo de unidad:', error);
      req.flash('error_msg', 'Error al actualizar el tipo de unidad');
      res.redirect(`/admin/tipos-unidad/edit/${id}`);
    }
  },

  deleteTipoUnidad: async (req, res) => {
    const { id } = req.params;
    const { empaque_id } = req.session.user;

    try {
      // Eliminar tipo de unidad (cambio de estado)
      const deletedTipoUnidad = await TipoUnidad.delete(id, empaque_id);

      if (!deletedTipoUnidad) {
        req.flash('error_msg', 'Tipo de unidad no encontrado o no tienes permiso');
      } else {
        req.flash('success_msg', 'Tipo de unidad eliminado exitosamente');
      }
      
      res.redirect('/admin/tipos-unidad');
    } catch (error) {
      console.error('Error al eliminar tipo de unidad:', error);
      req.flash('error_msg', 'Error al eliminar el tipo de unidad');
      res.redirect('/admin/tipos-unidad');
    }
  },

  listTiposUnidad: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const tiposUnidad = await TipoUnidad.getAllByEmpaque(empaque_id);

      res.render('admin/tipos-unidad/list', {
        user: req.session.user,
        tiposUnidad,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar tipos de unidad:', error);
      req.flash('error_msg', 'Error al cargar los tipos de unidad');
      res.redirect('/admin');
    }
  }
};

module.exports = tipoUnidadController;