const EstadoPedido = require('./models/EstadoPedido');
const estadoPedidoController = require('./controllers/estadoPedidoController');
const estadosPedidoRoutes = require('./routes/estadosPedidoRoutes');

module.exports = {
  EstadoPedido,
  estadoPedidoController,
  estadosPedidoRoutes
};