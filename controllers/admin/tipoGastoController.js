const TipoGasto = require('../../models/tipoGasto');

const tipoGastoController = {
  showAddForm: async (req, res) => {
    try {
      res.render('admin/tipos-gasto/add', {
        user: req.session.user,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/tipos-gasto');
    }
  },

  addTipoGasto: async (req, res) => {
    const { tipo_gasto } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!tipo_gasto) {
        req.flash('error_msg', 'El tipo de gasto es obligatorio');
        return res.redirect('/admin/tipos-gasto/add');
      }

      // Verificar si el tipo de gasto ya existe
      const tipoExists = await TipoGasto.isTipoGastoExists(tipo_gasto, empaque_id);
      if (tipoExists) {
        req.flash('error_msg', 'Este tipo de gasto ya está registrado');
        return res.redirect('/admin/tipos-gasto/add');
      }

      // Crear tipo de gasto
      await TipoGasto.create({
        tipo_gasto,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Tipo de gasto registrado exitosamente');
      res.redirect('/admin/tipos-gasto');
    } catch (error) {
      console.error('Error al crear tipo de gasto:', error);
      req.flash('error_msg', 'Error al registrar el tipo de gasto');
      res.redirect('/admin/tipos-gasto/add');
    }
  },

  showEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id } = req.session.user;
      
      const tipoGasto = await TipoGasto.getById(id, empaque_id);
      if (!tipoGasto) {
        req.flash('error_msg', 'Tipo de gasto no encontrado');
        return res.redirect('/admin/tipos-gasto');
      }

      res.render('admin/tipos-gasto/edit', {
        user: req.session.user,
        tipoGasto,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      req.flash('error_msg', 'Error al cargar el formulario de edición');
      res.redirect('/admin/tipos-gasto');
    }
  },

  updateTipoGasto: async (req, res) => {
    const { id } = req.params;
    const { tipo_gasto } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!tipo_gasto) {
        req.flash('error_msg', 'El tipo de gasto es obligatorio');
        return res.redirect(`/admin/tipos-gasto/edit/${id}`);
      }

      // Verificar si el tipo de gasto ya existe (excluyendo el actual)
      const tipoExists = await TipoGasto.isTipoGastoExists(tipo_gasto, empaque_id, id);
      if (tipoExists) {
        req.flash('error_msg', 'Este tipo de gasto ya está registrado');
        return res.redirect(`/admin/tipos-gasto/edit/${id}`);
      }

      // Actualizar tipo de gasto
      const updatedTipoGasto = await TipoGasto.update({
        pk_tipo_gasto: id,
        tipo_gasto,
        fk_empaque: empaque_id
      });

      if (!updatedTipoGasto) {
        req.flash('error_msg', 'Tipo de gasto no encontrado o no tienes permiso');
        return res.redirect('/admin/tipos-gasto');
      }

      req.flash('success_msg', 'Tipo de gasto actualizado exitosamente');
      res.redirect('/admin/tipos-gasto');
    } catch (error) {
      console.error('Error al actualizar tipo de gasto:', error);
      req.flash('error_msg', 'Error al actualizar el tipo de gasto');
      res.redirect(`/admin/tipos-gasto/edit/${id}`);
    }
  },

  deleteTipoGasto: async (req, res) => {
    const { id } = req.params;
    const { empaque_id } = req.session.user;

    try {
      // Eliminar tipo de gasto (cambio de estado)
      const deletedTipoGasto = await TipoGasto.delete(id, empaque_id);

      if (!deletedTipoGasto) {
        req.flash('error_msg', 'Tipo de gasto no encontrado o no tienes permiso');
      } else {
        req.flash('success_msg', 'Tipo de gasto eliminado exitosamente');
      }
      
      res.redirect('/admin/tipos-gasto');
    } catch (error) {
      console.error('Error al eliminar tipo de gasto:', error);
      req.flash('error_msg', 'Error al eliminar el tipo de gasto');
      res.redirect('/admin/tipos-gasto');
    }
  },

  listTiposGasto: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const tiposGasto = await TipoGasto.getAllByEmpaque(empaque_id);

      res.render('admin/tipos-gasto/list', {
        user: req.session.user,
        tiposGasto,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar tipos de gasto:', error);
      req.flash('error_msg', 'Error al cargar los tipos de gasto');
      res.redirect('/admin');
    }
  }
};

module.exports = tipoGastoController;