const router = require('./routes/categoriasRoutes');
const Categoria = require('./models/Categoria');
const categoriaController = require('./controllers/categoriaController');

module.exports = {
  router,
  Categoria,
  categoriaController
}; 