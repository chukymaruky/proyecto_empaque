const Gasto = require('../../models/Gasto');

const gastoController = {
  showAddForm: async (req, res) => {
    try {
      const tiposGasto = await Gasto.getTiposGasto();
      let pedidos = [];
      let empaques = [];
      
      // Si es administrador, obtener lista de empaques
      if (req.session.user.rol === 'administrador') {
        const Empaque = require('../../models/empaque');
        empaques = await Empaque.getAllActive();
      } else {
        // Si no es admin, obtener pedidos de su empaque
        pedidos = await Gasto.getPedidosByEmpaque(req.session.user.empaque_id);
      }
      
      res.render('admin/gastos/add', {
        user: req.session.user,
        tiposGasto,
        pedidos,
        empaques,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg'),
        formData: null
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error al cargar el formulario');
      res.redirect('/admin/gastos');
    }
  },

  addGasto: async (req, res) => {
    const { concepto, monto, tipo_gasto_id, pedido_id, empaque_id: selectedEmpaqueId } = req.body;
    let empaqueId;

    // Determinar el empaque según el rol del usuario
    if (req.session.user.rol === 'administrador') {
      if (!selectedEmpaqueId) {
        req.flash('error_msg', 'Debe seleccionar un empaque');
        return res.redirect('/admin/gastos/add');
      }
      empaqueId = selectedEmpaqueId;
    } else {
      empaqueId = req.session.user.empaque_id;
    }

    try {
      // Validar monto positivo
      if (parseFloat(monto) <= 0) {
        req.flash('error_msg', 'El monto debe ser mayor a cero');
        return res.redirect('/admin/gastos/add');
      }

      // Crear gasto
      await Gasto.create({
        concepto,
        monto,
        fk_tipo_gasto: tipo_gasto_id,
        fk_pedido: pedido_id || null,
        fk_empaque: empaqueId
      });

      req.flash('success_msg', 'Gasto registrado exitosamente');
      res.redirect('/admin/gastos');
    } catch (error) {
      console.error('Error al crear gasto:', error);
      req.flash('error_msg', 'Error al registrar el gasto');
      res.redirect('/admin/gastos/add');
    }
  },

  listGastos: async (req, res) => {
    try {
      const { empaque_id } = req.session.user;
      let gastos;
      let empaques = [];
      
      // Si es administrador, obtener todos los empaques y gastos
      if (req.session.user.rol === 'administrador') {
        const Empaque = require('../../models/empaque');
        empaques = await Empaque.getAllActive();
        // Si hay un filtro de empaque, usarlo
        if (req.query.empaque) {
          gastos = await Gasto.getAllByEmpaque(req.query.empaque);
        } else {
          gastos = await Gasto.getAll();
        }
      } else {
        // Si no es admin, solo obtener los gastos de su empaque
        gastos = await Gasto.getAllByEmpaque(empaque_id);
      }

      // Obtener el mes y año actual
      const today = new Date();
      const currentMonth = today.getMonth(); // 0-11
      const currentYear = today.getFullYear();

      // Calcular total de los gastos filtrados
      const total = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.monto), 0);

      // Calcular total del mes actual
      const totalMesActual = gastos.reduce((sum, gasto) => {
        const gastoDate = new Date(gasto.fecha);
        if (gastoDate.getMonth() === currentMonth && gastoDate.getFullYear() === currentYear) {
          return sum + parseFloat(gasto.monto);
        }
        return sum;
      }, 0);

      res.render('admin/gastos/list', {
        user: req.session.user,
        gastos,
        empaques,
        selectedEmpaque: req.query.empaque || '',
        searchQuery: req.query.search || '',
        total: total.toFixed(2),
        totalMesActual: totalMesActual.toFixed(2),
        mesActual: new Date().toLocaleString('es-ES', { month: 'long' }),
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
      });
    } catch (error) {
      console.error('Error al listar gastos:', error);
      req.flash('error_msg', 'Error al cargar los gastos');
      res.redirect('/admin');
    }
  }
};

module.exports = gastoController;