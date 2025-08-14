const TipoVehiculo = require('../../models/tipoVehiculo');

const tipoVehiculoController = {
  showAddForm: async (req, res) => {
    try {
      res.render('admin/tipos-vehiculo/add', {
        user: req.session.user,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/tipos-vehiculo');
    }
  },

  addTipoVehiculo: async (req, res) => {
    const { tipo_vehiculo, capacidad_carga_kg } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!tipo_vehiculo || !capacidad_carga_kg) {
        req.flash('error_msg', 'Complete todos los campos obligatorios');
        return res.redirect('/admin/tipos-vehiculo/add');
      }

      // Validar que la capacidad sea un número positivo
      const capacidadNum = parseFloat(capacidad_carga_kg);
      if (isNaN(capacidadNum) || capacidadNum <= 0) {
        req.flash('error_msg', 'La capacidad de carga debe ser un número positivo');
        return res.redirect('/admin/tipos-vehiculo/add');
      }

      // Verificar si el tipo de vehículo ya existe
      const tipoExists = await TipoVehiculo.isTipoVehiculoExists(tipo_vehiculo, empaque_id);
      if (tipoExists) {
        req.flash('error_msg', 'Este tipo de vehículo ya está registrado');
        return res.redirect('/admin/tipos-vehiculo/add');
      }

      // Crear tipo de vehículo
      await TipoVehiculo.create({
        tipo_vehiculo,
        capacidad_carga_kg: capacidadNum,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Tipo de vehículo registrado exitosamente');
      res.redirect('/admin/tipos-vehiculo');
    } catch (error) {
      console.error('Error al crear tipo de vehículo:', error);
      req.flash('error_msg', 'Error al registrar el tipo de vehículo');
      res.redirect('/admin/tipos-vehiculo/add');
    }
  },

  showEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id } = req.session.user;
      
      const tipoVehiculo = await TipoVehiculo.getById(id, empaque_id);
      if (!tipoVehiculo) {
        req.flash('error_msg', 'Tipo de vehículo no encontrado');
        return res.redirect('/admin/tipos-vehiculo');
      }

      res.render('admin/tipos-vehiculo/edit', {
        user: req.session.user,
        tipoVehiculo,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      req.flash('error_msg', 'Error al cargar el formulario de edición');
      res.redirect('/admin/tipos-vehiculo');
    }
  },

  updateTipoVehiculo: async (req, res) => {
    const { id } = req.params;
    const { tipo_vehiculo, capacidad_carga_kg } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!tipo_vehiculo || !capacidad_carga_kg) {
        req.flash('error_msg', 'Complete todos los campos obligatorios');
        return res.redirect(`/admin/tipos-vehiculo/edit/${id}`);
      }

      // Validar que la capacidad sea un número positivo
      const capacidadNum = parseFloat(capacidad_carga_kg);
      if (isNaN(capacidadNum) || capacidadNum <= 0) {
        req.flash('error_msg', 'La capacidad de carga debe ser un número positivo');
        return res.redirect(`/admin/tipos-vehiculo/edit/${id}`);
      }

      // Verificar si el tipo de vehículo ya existe (excluyendo el actual)
      const tipoExists = await TipoVehiculo.isTipoVehiculoExists(tipo_vehiculo, empaque_id, id);
      if (tipoExists) {
        req.flash('error_msg', 'Este tipo de vehículo ya está registrado');
        return res.redirect(`/admin/tipos-vehiculo/edit/${id}`);
      }

      // Actualizar tipo de vehículo
      const updatedTipoVehiculo = await TipoVehiculo.update({
        pk_tipo_vehiculo: id,
        tipo_vehiculo,
        capacidad_carga_kg: capacidadNum,
        fk_empaque: empaque_id
      });

      if (!updatedTipoVehiculo) {
        req.flash('error_msg', 'Tipo de vehículo no encontrado o no tienes permiso');
        return res.redirect('/admin/tipos-vehiculo');
      }

      req.flash('success_msg', 'Tipo de vehículo actualizado exitosamente');
      res.redirect('/admin/tipos-vehiculo');
    } catch (error) {
      console.error('Error al actualizar tipo de vehículo:', error);
      req.flash('error_msg', 'Error al actualizar el tipo de vehículo');
      res.redirect(`/admin/tipos-vehiculo/edit/${id}`);
    }
  },

  deleteTipoVehiculo: async (req, res) => {
    const { id } = req.params;
    const { empaque_id } = req.session.user;

    try {
      // Eliminar tipo de vehículo (cambio de estado)
      const deletedTipoVehiculo = await TipoVehiculo.delete(id, empaque_id);

      if (!deletedTipoVehiculo) {
        req.flash('error_msg', 'Tipo de vehículo no encontrado o no tienes permiso');
      } else {
        req.flash('success_msg', 'Tipo de vehículo eliminado exitosamente');
      }
      
      res.redirect('/admin/tipos-vehiculo');
    } catch (error) {
      console.error('Error al eliminar tipo de vehículo:', error);
      req.flash('error_msg', 'Error al eliminar el tipo de vehículo');
      res.redirect('/admin/tipos-vehiculo');
    }
  },

  listTiposVehiculo: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const tiposVehiculo = await TipoVehiculo.getAllByEmpaque(empaque_id);

      res.render('admin/tipos-vehiculo/list', {
        user: req.session.user,
        tiposVehiculo,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar tipos de vehículo:', error);
      req.flash('error_msg', 'Error al cargar los tipos de vehículo');
      res.redirect('/admin');
    }
  }
};

module.exports = tipoVehiculoController;