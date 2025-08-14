const Transporte = require('../../models/transporte');
const TipoVehiculo = require('../../models/tipoVehiculo');
const Empresa = require('../../models/Empresa');

const transporteController = {
  showAddForm: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      
      const tiposVehiculo = await Transporte.getTiposVehiculoByEmpaque(empaque_id);
      const empresas = await Transporte.getEmpresasByEmpaque(empaque_id);

      res.render('admin/transportes/add', {
        user: req.session.user,
        tiposVehiculo,
        empresas,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/transportes');
    }
  },

  addTransporte: async (req, res) => {
    const { 
      numero_placa, 
      color, 
      marca, 
      numero_oficial, 
      tipo_vehiculo_id,
      empresa_id
    } = req.body;
    
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!numero_placa || !color || !marca || !tipo_vehiculo_id) {
        req.flash('error_msg', 'Complete los campos obligatorios');
        return res.redirect('/admin/transportes/add');
      }

      // Verificar si la placa ya existe
      const placaExists = await Transporte.isPlacaExists(numero_placa, empaque_id);
      if (placaExists) {
        req.flash('error_msg', 'Este número de placa ya está registrado');
        return res.redirect('/admin/transportes/add');
      }

      // Crear transporte
      await Transporte.create({
        numero_placa,
        color,
        marca,
        numero_oficial: numero_oficial || null,
        fk_tipo_vehiculo: tipo_vehiculo_id,
        fk_empresa: empresa_id || null,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Transporte registrado exitosamente');
      res.redirect('/admin/transportes');
    } catch (error) {
      console.error('Error al crear transporte:', error);
      req.flash('error_msg', 'Error al registrar el transporte');
      res.redirect('/admin/transportes/add');
    }
  },

  showEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id } = req.session.user;
      
      const transporte = await Transporte.getById(id, empaque_id);
      if (!transporte) {
        req.flash('error_msg', 'Transporte no encontrado');
        return res.redirect('/admin/transportes');
      }

      const tiposVehiculo = await Transporte.getTiposVehiculoByEmpaque(empaque_id);
      const empresas = await Transporte.getEmpresasByEmpaque(empaque_id);

      res.render('admin/transportes/edit', {
        user: req.session.user,
        transporte,
        tiposVehiculo,
        empresas,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      req.flash('error_msg', 'Error al cargar el formulario de edición');
      res.redirect('/admin/transportes');
    }
  },

  updateTransporte: async (req, res) => {
    const { id } = req.params;
    const { 
      numero_placa, 
      color, 
      marca, 
      numero_oficial, 
      tipo_vehiculo_id,
      empresa_id
    } = req.body;
    
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!numero_placa || !color || !marca || !tipo_vehiculo_id) {
        req.flash('error_msg', 'Complete los campos obligatorios');
        return res.redirect(`/admin/transportes/edit/${id}`);
      }

      // Verificar si la placa ya existe (excluyendo el actual)
      const placaExists = await Transporte.isPlacaExists(numero_placa, empaque_id, id);
      if (placaExists) {
        req.flash('error_msg', 'Este número de placa ya está registrado');
        return res.redirect(`/admin/transportes/edit/${id}`);
      }

      // Actualizar transporte
      const updatedTransporte = await Transporte.update({
        pk_transporte: id,
        numero_placa,
        color,
        marca,
        numero_oficial: numero_oficial || null,
        fk_tipo_vehiculo: tipo_vehiculo_id,
        fk_empresa: empresa_id || null,
        fk_empaque: empaque_id
      });

      if (!updatedTransporte) {
        req.flash('error_msg', 'Transporte no encontrado o no tienes permiso');
        return res.redirect('/admin/transportes');
      }

      req.flash('success_msg', 'Transporte actualizado exitosamente');
      res.redirect('/admin/transportes');
    } catch (error) {
      console.error('Error al actualizar transporte:', error);
      req.flash('error_msg', 'Error al actualizar el transporte');
      res.redirect(`/admin/transportes/edit/${id}`);
    }
  },

  deleteTransporte: async (req, res) => {
    const { id } = req.params;
    const { empaque_id } = req.session.user;

    try {
      // Eliminar transporte (cambio de estado)
      const deletedTransporte = await Transporte.delete(id, empaque_id);

      if (!deletedTransporte) {
        req.flash('error_msg', 'Transporte no encontrado o no tienes permiso');
      } else {
        req.flash('success_msg', 'Transporte eliminado exitosamente');
      }
      
      res.redirect('/admin/transportes');
    } catch (error) {
      console.error('Error al eliminar transporte:', error);
      req.flash('error_msg', 'Error al eliminar el transporte');
      res.redirect('/admin/transportes');
    }
  },

  listTransportes: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const transportes = await Transporte.getAllByEmpaque(empaque_id);

      res.render('admin/transportes/list', {
        user: req.session.user,
        transportes,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar transportes:', error);
      req.flash('error_msg', 'Error al cargar los transportes');
      res.redirect('/admin');
    }
  }
};

module.exports = transporteController;