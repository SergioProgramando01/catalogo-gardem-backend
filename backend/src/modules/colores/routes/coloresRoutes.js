/**
 * Rutas para el módulo de Colores.
 * Todas las explicaciones y comentarios están en español según preferencia del usuario.
 */

const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorControllers');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// Rutas públicas (sin autenticación)
router.get('/', colorController.obtenerTodas);
router.get('/con-conteo', colorController.obtenerConConteo);
router.get('/:id', colorController.obtenerPorId);

// Rutas protegidas (requieren autenticación de administrador)
router.post('/', authMiddleware, adminMiddleware, colorController.crear);
router.put('/:id', authMiddleware, adminMiddleware, colorController.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, colorController.eliminar);

module.exports = router;