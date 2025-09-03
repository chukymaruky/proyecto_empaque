//controllers/admin/empresaController.js

const Empresa = require('../../models/Empresa');
const Empaque = require('../../models/empaque');
const validateRFC = require('../../helpers/rfcValidator');

const empresaController = {
  showAddForm: async (req, res) => {
  try {
    const empaques = await Empaque.getAllActive();
    res.render('admin/empresas/add', {
      user: req.session.user,
      empresa: null,
      empaques: empaques
    });
  } catch (error) {
    console.error('Error al cargar formulario:', error);
    req.flash('error_msg', 'Error al cargar el formulario');
    res.redirect('/admin/empresas');
  }
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
    representante_legal,
    fk_empaque
  } = req.body;

  try {
    // Validar RFC si se proporcionó
    if (rfc && !validateRFC(rfc)) {
      req.flash('error_msg', 'El RFC no tiene un formato válido');
      const empaques = await Empaque.getAllActive();
      return res.render('admin/empresas/add', {
        user: req.session.user,
        empresa: req.body,
        empaques: empaques
      });
    }

    await Empresa.create({
      razon_social,
      nombre_comercial,
      rfc,
      regimen_fiscal,
      domicilio_fiscal,
      telefono_contacto,
      email_contacto,
      representante_legal,
      fk_empaque: fk_empaque || req.session.user.empaque_id
    });

    req.flash('success_msg', 'Empresa registrada exitosamente');
    res.redirect('/admin/empresas');
  } catch (error) {
    console.error('Error al registrar empresa:', error);
    const empaques = await Empaque.getAllActive();
    req.flash('error_msg', 'Error al registrar la empresa');
    res.render('admin/empresas/add', {
      user: req.session.user,
      empresa: req.body,
      empaques: empaques
    });
  }
},

listEmpresas: async (req, res) => {
    try {
      let empresas;
      let empaques = []; // Inicializamos como array vacío por defecto
      
      // Obtener todas las empresas según el rol del usuario
      if (req.session.user.rol === 'administrador') {
        empresas = await Empresa.getAll();
        empaques = await Empaque.getAllActive(); // Solo administradores ven todos los empaques
      } else {
        empresas = await Empresa.getAllByEmpaque(req.session.user.empaque_id);
        // Para usuarios no administradores, solo mostramos su empaque en el filtro
        const empaqueUsuario = await Empaque.getById(req.session.user.empaque_id);
        if (empaqueUsuario) {
          empaques = [empaqueUsuario];
        }
      }

      // Crear un mapa de empaques para fácil acceso
      const empaquesMap = {};
      empaques.forEach(e => empaquesMap[e.pk_empaque] = e);

      res.render('admin/empresas/list', {
        user: req.session.user,
        empresas: empresas || [], // Aseguramos que siempre sea un array
        empaques: empaques, // Pasamos el array de empaques
        empaquesMap: empaquesMap, // Pasamos el mapa de empaques
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
      });
    } catch (error) {
      console.error('Error al listar empresas:', error);
      req.flash('error_msg', 'Error al cargar el listado de empresas');
      res.redirect('/admin');
    }
  },

  showEditForm: async (req, res) => {
  try {
    const { id } = req.params;
    const empaques = await Empaque.getAllActive();
    const empresa = await Empresa.getById(id);
    
    res.render('admin/empresas/edit', {
      user: req.session.user,
      empresa: empresa,
      empaques: empaques
    });
  } catch (error) {
    console.error('Error al cargar formulario de edición:', error);
    req.flash('error_msg', 'Error al cargar el formulario de edición');
    res.redirect('/admin/empresas');
  }
},

};

module.exports = empresaController;