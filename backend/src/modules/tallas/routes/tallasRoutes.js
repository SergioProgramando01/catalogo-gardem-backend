/**
 * Rutas para el módulo de Tallas.
 * Todas las explicaciones y comentarios están en español según preferencia del usuario.
 */

const express = require('express');
const router = express.Router();
const tallaController = require('../controllers/tallaController');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// Rutas públicas (sin autenticación)
router.get('/', tallaController.obtenerTodas);
router.get('/con-conteo', tallaController.obtenerConConteo);
router.get('/:id', tallaController.obtenerPorId);

// Rutas protegidas (requieren autenticación de administrador)
router.post('/', authMiddleware, adminMiddleware, tallaController.crear);
router.put('/:id', authMiddleware, adminMiddleware, tallaController.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, tallaController.eliminar);

module.exports = router;