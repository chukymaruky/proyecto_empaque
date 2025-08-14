const Rol = require('../../models/rol');
const Empaque = require('../../models/empaque');

const rolController = {
  showAddForm: async (req, res) => {
    try {
      // Obtener todos los empaques activos
      const empaques = await Empaque.getAllActive();
      
      res.render('admin/rol/add', {
        user: req.session.user,
        empaques,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/rol');
    }
  },

   addRol: async (req, res) => {
    const { rol, empaque } = req.body;
    const { empaque_id } = req.session.user; // Empaque del usuario logueado

    try {
      // Validaciones básicas
      if (!rol || !empaque) {
        req.flash('error_msg', 'Todos los campos son obligatorios');
        return res.redirect('/admin/rol/add');
      }

      // Verificar si el empaque existe
      const empaqueExists = await Empaque.getById(empaque);
      if (!empaqueExists) {
        req.flash('error_msg', 'El empaque seleccionado no existe');
        return res.redirect('/admin/rol/add');
      }

       // Verificar si el rol ya existe para este empaque
      const roleExists = await Rol.isRoleExists(rol, empaque);
      if (roleExists) {
        req.flash('error_msg', 'Este rol ya está registrado para el empaque seleccionado');
        return res.redirect('/admin/rol/add');
      }

      // Crear rol
      await Rol.create({
        rol,
        fk_empaque: empaque
      });

      req.flash('success_msg', 'Rol registrado exitosamente');
      res.redirect('/admin/rol');
    } catch (error) {
      console.error('Error al crear rol:', error);
      req.flash('error_msg', 'Error al registrar el rol');
      res.redirect('/admin/rol/add');
    }
  },

  showEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id } = req.session.user;
      
      const rol = await Rol.getById(id, empaque_id);
      if (!rol) {
        req.flash('error_msg', 'Rol no encontrado');
        return res.redirect('/admin/rol');
      }

      res.render('admin/rol/edit', {
        user: req.session.user,
        rol,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      req.flash('error_msg', 'Error al cargar el formulario de edición');
      res.redirect('/admin/rol');
    }
  },

  updateRol: async (req, res) => {
    const { id } = req.params;
    const { rol } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!rol) {
        req.flash('error_msg', 'El nombre del rol es obligatorio');
        return res.redirect(`/admin/rol/edit/${id}`);
      }

      // Verificar si el rol ya existe (excluyendo el actual)
      const roleExists = await Rol.isRoleExists(rol, empaque_id, id);
      if (roleExists) {
        req.flash('error_msg', 'Este rol ya está registrado');
        return res.redirect(`/admin/rol/edit/${id}`);
      }

      // Actualizar rol
      const updatedRol = await Rol.update({
        pk_rol: id,
        rol,
        fk_empaque: empaque_id
      });

      if (!updatedRol) {
        req.flash('error_msg', 'Rol no encontrado o no tienes permiso');
        return res.redirect('/admin/rol');
      }

      req.flash('success_msg', 'Rol actualizado exitosamente');
      res.redirect('/admin/rol');
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      req.flash('error_msg', 'Error al actualizar el rol');
      res.redirect(`/admin/rol/edit/${id}`);
    }
  },

  deleteRol: async (req, res) => {
    const { id } = req.params;
    const { empaque_id } = req.session.user;

    try {
      // Eliminar rol (cambio de estado)
      const deletedRol = await Rol.delete(id, empaque_id);

      if (!deletedRol) {
        req.flash('error_msg', 'Rol no encontrado o no tienes permiso');
      } else {
        req.flash('success_msg', 'Rol eliminado exitosamente');
      }

      res.redirect('/admin/rol');
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      req.flash('error_msg', 'Error al eliminar el rol');
      res.redirect('/admin/rol');
    }
  },

  listRoles: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const roles = await Rol.getAll();

      res.render('admin/rol/list', {
        user: req.session.user,
        roles,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar roles:', error);
      req.flash('error_msg', 'Error al cargar los roles');
      res.redirect('/admin');
    }
  }
};

module.exports = rolController;