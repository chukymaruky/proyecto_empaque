const Salario = require('../../models/salario');
const Empleado = require('../../models/Empleado');

const salarioController = {
  showAddForm: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const empleados = await Salario.getEmpleadosByEmpaque(empaque_id);

      res.render('admin/salarios/add', {
        user: req.session.user,
        empleados,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/salarios');
    }
  },

  addSalario: async (req, res) => {
    const { empleado_id, cantidad_salario } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!empleado_id || !cantidad_salario) {
        req.flash('error_msg', 'Complete todos los campos obligatorios');
        return res.redirect('/admin/salarios/add');
      }

      // Validar que el salario sea un número positivo
      const salarioNum = parseFloat(cantidad_salario);
      if (isNaN(salarioNum) || salarioNum <= 0) {
        req.flash('error_msg', 'El salario debe ser un número positivo');
        return res.redirect('/admin/salarios/add');
      }

      // Verificar si el empleado ya tiene un salario activo
      const hasSalary = await Salario.hasActiveSalary(empleado_id);
      if (hasSalary) {
        req.flash('error_msg', 'Este empleado ya tiene un salario registrado');
        return res.redirect('/admin/salarios/add');
      }

      // Crear salario
      await Salario.create({
        cantidad_salario: salarioNum,
        fk_empleado: empleado_id,
        fk_empaque: empaque_id
      });

      req.flash('success_msg', 'Salario registrado exitosamente');
      res.redirect('/admin/salarios');
    } catch (error) {
      console.error('Error al crear salario:', error);
      req.flash('error_msg', 'Error al registrar el salario');
      res.redirect('/admin/salarios/add');
    }
  },

  showEditForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { empaque_id } = req.session.user;
      
      const salario = await Salario.getById(id, empaque_id);
      if (!salario) {
        req.flash('error_msg', 'Salario no encontrado');
        return res.redirect('/admin/salarios');
      }

      res.render('admin/salarios/edit', {
        user: req.session.user,
        salario,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al cargar formulario de edición:', error);
      req.flash('error_msg', 'Error al cargar el formulario de edición');
      res.redirect('/admin/salarios');
    }
  },

  updateSalario: async (req, res) => {
    const { id } = req.params;
    const { cantidad_salario } = req.body;
    const { empaque_id } = req.session.user;

    try {
      // Validaciones básicas
      if (!cantidad_salario) {
        req.flash('error_msg', 'El monto del salario es obligatorio');
        return res.redirect(`/admin/salarios/edit/${id}`);
      }

      // Validar que el salario sea un número positivo
      const salarioNum = parseFloat(cantidad_salario);
      if (isNaN(salarioNum) || salarioNum <= 0) {
        req.flash('error_msg', 'El salario debe ser un número positivo');
        return res.redirect(`/admin/salarios/edit/${id}`);
      }

      // Actualizar salario
      const updatedSalario = await Salario.update({
        pk_salario: id,
        cantidad_salario: salarioNum,
        fk_empaque: empaque_id
      });

      if (!updatedSalario) {
        req.flash('error_msg', 'Salario no encontrado o no tienes permiso');
        return res.redirect('/admin/salarios');
      }

      req.flash('success_msg', 'Salario actualizado exitosamente');
      res.redirect('/admin/salarios');
    } catch (error) {
      console.error('Error al actualizar salario:', error);
      req.flash('error_msg', 'Error al actualizar el salario');
      res.redirect(`/admin/salarios/edit/${id}`);
    }
  },

  deleteSalario: async (req, res) => {
    const { id } = req.params;
    const { empaque_id } = req.session.user;

    try {
      // Eliminar salario (cambio de estado)
      const deletedSalario = await Salario.delete(id, empaque_id);

      if (!deletedSalario) {
        req.flash('error_msg', 'Salario no encontrado o no tienes permiso');
      } else {
        req.flash('success_msg', 'Salario eliminado exitosamente');
      }
      
      res.redirect('/admin/salarios');
    } catch (error) {
      console.error('Error al eliminar salario:', error);
      req.flash('error_msg', 'Error al eliminar el salario');
      res.redirect('/admin/salarios');
    }
  },

  listSalarios: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      const salarios = await Salario.getAllByEmpaque(empaque_id);

      res.render('admin/salarios/list', {
        user: req.session.user,
        salarios,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar salarios:', error);
      req.flash('error_msg', 'Error al cargar los salarios');
      res.redirect('/admin');
    }
  }
};

module.exports = salarioController;