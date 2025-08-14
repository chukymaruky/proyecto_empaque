const Transportista = require('../../models/transportista');
const DatoPersona = require('../../models/DatoPersona');
const Empresa = require('../../models/Empresa');

const transportistaController = {
  showAddForm: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      
      const personas = await Transportista.getPersonasDisponibles(empaque_id);
      const empresas = await Transportista.getEmpresasByEmpaque(empaque_id);

      res.render('admin/transportistas/add', {
        user: req.session.user,
        personas,
        empresas,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/transportistas');
    }
  },

  addTransportista: async (req, res) => {
    const { persona_id, empresa_id } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!persona_id) {
        req.flash('error_msg', 'Seleccione una persona');
        return res.redirect('/admin/transportistas/add');
      }

      // Verificar si la persona ya es transportista
      const isTransportista = await Transportista.isPersonaTransportista(persona_id);
      if (isTransportista) {
        req.flash('error_msg', 'Esta persona ya está registrada como transportista');
        return res.redirect('/admin/transportistas/add');
      }

      // Crear transportista
      await Transportista.create({
        fk_dato_persona: persona_id,
        fk_empresa: empresa_id || null,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Transportista registrado exitosamente');
      res.redirect('/admin/transportistas');
    } catch (error) {
      console.error('Error al crear transportista:', error);
      req.flash('error_msg', 'Error al registrar el transportista');
      res.redirect('/admin/transportistas/add');
    }
  },

  showEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id } = req.session.user;
      
      const transportista = await Transportista.getById(id, empaque_id);
      if (!transportista) {
        req.flash('error_msg', 'Transportista no encontrado');
        return res.redirect('/admin/transportistas');
      }

      const empresas = await Transportista.getEmpresasByEmpaque(empaque_id);

      res.render('admin/transportistas/edit', {
        user: req.session.user,
        transportista,
        empresas,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      req.flash('error_msg', 'Error al cargar el formulario de edición');
      res.redirect('/admin/transportistas');
    }
  },

  updateTransportista: async (req, res) => {
    const { id } = req.params;
    const { empresa_id } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Actualizar transportista
      const updatedTransportista = await Transportista.update({
        pk_transportista: id,
        fk_empresa: empresa_id || null,
        fk_empaque: empaque_id
      });

      if (!updatedTransportista) {
        req.flash('error_msg', 'Transportista no encontrado o no tienes permiso');
        return res.redirect('/admin/transportistas');
      }

      req.flash('success_msg', 'Transportista actualizado exitosamente');
      res.redirect('/admin/transportistas');
    } catch (error) {
      console.error('Error al actualizar transportista:', error);
      req.flash('error_msg', 'Error al actualizar el transportista');
      res.redirect(`/admin/transportistas/edit/${id}`);
    }
  },

  deleteTransportista: async (req, res) => {
    const { id } = req.params;
    const { empaque_id } = req.session.user;

    try {
      // Eliminar transportista (cambio de estado)
      const deletedTransportista = await Transportista.delete(id, empaque_id);

      if (!deletedTransportista) {
        req.flash('error_msg', 'Transportista no encontrado o no tienes permiso');
      } else {
        req.flash('success_msg', 'Transportista eliminado exitosamente');
      }
      
      res.redirect('/admin/transportistas');
    } catch (error) {
      console.error('Error al eliminar transportista:', error);
      req.flash('error_msg', 'Error al eliminar el transportista');
      res.redirect('/admin/transportistas');
    }
  },

  listTransportistas: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const transportistas = await Transportista.getAllByEmpaque(empaque_id);

      res.render('admin/transportistas/list', {
        user: req.session.user,
        transportistas,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar transportistas:', error);
      req.flash('error_msg', 'Error al cargar los transportistas');
      res.redirect('/admin');
    }
  }
};

module.exports = transportistaController;