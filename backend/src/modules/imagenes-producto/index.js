const router = require('./routes/imagenesProductoRoutes');
const ImagenProducto = require('./models/ImagenProducto');
const imagenProductoController = require('./controllers/imagenProductoController');

module.exports = {
  router,
  ImagenProducto,
  imagenProductoController
};