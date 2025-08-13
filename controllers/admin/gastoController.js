const Gasto = require('../../models/gasto');

const gastoController = {
  showAddForm: async (req, res) => {
    try {
      const tiposGasto = await Gasto.getTiposGasto();
      const pedidos = await Gasto.getPedidosByEmpaque(req.session.user.empaque_id);
      
      res.render('admin/gastos/add', {
        user: req.session.user,
        tiposGasto,
        pedidos,
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
    const { concepto, monto, tipo_gasto_id, pedido_id } = req.body;
    const { empaque_id } = req.session.user;

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
        fk_empaque: empaque_id
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
      const gastos = await Gasto.getAllByEmpaque(empaque_id);

      // Calcular total
      const total = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.monto), 0);

      res.render('admin/gastos/list', {
        user: req.session.user,
        gastos,
        total: total.toFixed(2),
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