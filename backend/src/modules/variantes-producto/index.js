const router = require('./routes/variantesProductoRoutes');
const VarianteProducto = require('./models/VarianteProducto');
const varianteProductoController = require('./controllers/varianteProductoController');

module.exports = {
  router,
  VarianteProducto,
  varianteProductoController
};