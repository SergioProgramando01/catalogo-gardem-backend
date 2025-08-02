const router = require('./routes/cestaPedidoRoutes');
const CestaPedido = require('./models/CestaPedido');
const cestaPedidoController = require('./controllers/cestaPedidoController');

module.exports = {
  router,
  CestaPedido,
  cestaPedidoController
}; 