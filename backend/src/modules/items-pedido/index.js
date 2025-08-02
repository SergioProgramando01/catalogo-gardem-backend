const express = require('express');
const router = express.Router();
const itemsPedidoRoutes = require('./routes/itemsPedidoRoutes');

// Registrar rutas del módulo
router.use('/items-pedido', itemsPedidoRoutes);

module.exports = {
  router,
  routes: itemsPedidoRoutes
}; 