const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authService = require('../services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// Rutas públicas (sin autenticación)
router.post('/registrar', usuarioController.registrar);
router.post('/login', usuarioController.login);

// Rutas protegidas (requieren autenticación)
router.get('/perfil', authMiddleware, usuarioController.obtenerPerfil);
router.put('/cambiar-contraseña', authMiddleware, usuarioController.cambiarContraseña);
router.get('/verificar-token', authMiddleware, usuarioController.verificarToken);

// Rutas de administrador (requieren rol de administrador)
router.get('/', authMiddleware, adminMiddleware, usuarioController.obtenerTodos);
router.get('/:id', authMiddleware, adminMiddleware, usuarioController.obtenerPorId);
router.put('/:id', authMiddleware, adminMiddleware, usuarioController.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, usuarioController.eliminar);

module.exports = router; 