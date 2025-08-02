const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// Rutas públicas (sin autenticación)
router.get('/', categoriaController.obtenerTodas);
router.get('/con-conteo', categoriaController.obtenerConConteo);
router.get('/:id', categoriaController.obtenerPorId);

// Rutas protegidas (requieren autenticación de administrador)
router.post('/', authMiddleware, adminMiddleware, categoriaController.crear);
router.put('/:id', authMiddleware, adminMiddleware, categoriaController.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, categoriaController.eliminar);
router.delete('/:id/permanente', authMiddleware, adminMiddleware, categoriaController.eliminarPermanente);
router.put('/:id/activar', authMiddleware, adminMiddleware, categoriaController.activar);

module.exports = router; 