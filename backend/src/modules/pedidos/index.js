const express = require('express');
const router = express.Router();
const pedidosRoutes = require('./routes/pedidosRoutes');

// Registrar rutas del módulo
router.use('/pedidos', pedidosRoutes);

module.exports = {
  router,
  routes: pedidosRoutes
}; 