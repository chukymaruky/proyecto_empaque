const Empresa = require('../../models/Empresa');
const validateRFC = require('../../helpers/rfcValidator');

const empresaController = {
  showAddForm: (req, res) => {
    res.render('admin/empresas/add', {
      user: req.session.user,
      empresa: null // Para uso en edición
    });
  },

  addEmpresa: async (req, res) => {
    const {
      razon_social,
      nombre_comercial,
      rfc,
      regimen_fiscal,
      domicilio_fiscal,
      telefono_contacto,
      email_contacto,
      representante_legal
    } = req.body;

    try {
      await Empresa.create({
        razon_social,
        nombre_comercial,
        rfc,
        regimen_fiscal,
        domicilio_fiscal,
        telefono_contacto,
        email_contacto,
        representante_legal,
        fk_empaque: req.session.user.empaque_id
      });

          // En el método addEmpresa
if (rfc && !validateRFC(rfc)) {
  req.flash('error_msg', 'El RFC no tiene un formato válido');
  return res.render('admin/empresas/add', {
    user: req.session.user,
    empresa: req.body
  });
}


      req.flash('success_msg', 'Empresa registrada exitosamente');
      res.redirect('/admin/empresas');
    } catch (error) {
      console.error('Error al registrar empresa:', error);
      req.flash('error_msg', 'Error al registrar la empresa');
      res.render('admin/empresas/add', {
        user: req.session.user,
        empresa: req.body // Para mantener los datos del formulario
      });
    }
  },

  listEmpresas: async (req, res) => {
    try {
      let empresas;
      if (req.session.user.rol === 'administrador') {
        empresas = await Empresa.getAll();
      } else {
        empresas = await Empresa.getAllByEmpaque(req.session.user.empaque_id);
      }

      res.render('admin/empresas/list', {
        user: req.session.user,
        empresas,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
      });
    } catch (error) {
      console.error('Error al listar empresas:', error);
      req.flash('error_msg', 'Error al cargar el listado de empresas');
      res.redirect('/admin');
    }
  }
};

module.exports = empresaController;