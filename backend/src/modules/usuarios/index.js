const router = require('./routes/usuariosRoutes');
const Usuario = require('./models/Usuario');
const authService = require('./services/authService');
const usuarioController = require('./controllers/usuarioController');

module.exports = {
  router,
  Usuario,
  authService,
  usuarioController
}; 