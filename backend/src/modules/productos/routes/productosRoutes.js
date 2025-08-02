/**
 * Rutas para el módulo de Productos.
 * Todas las explicaciones y comentarios están en español según preferencia del usuario.
 */

const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authService = require('../../../../src/modules/usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// Rutas públicas (sin autenticación)
router.get('/', productoController.obtenerTodas);
router.get('/buscar', productoController.buscarPorNombre);
router.get('/con-conteo', productoController.obtenerConConteo);
router.get('/categoria/:id_categoria', productoController.obtenerPorCategoria);
router.get('/:id', productoController.obtenerPorId);

// Rutas protegidas (requieren autenticación de administrador)
router.post('/', authMiddleware, adminMiddleware, productoController.crear);
router.put('/:id', authMiddleware, adminMiddleware, productoController.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, productoController.eliminar);

module.exports = router;