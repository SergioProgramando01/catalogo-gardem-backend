const express = require('express');
const router = express.Router();
const imagenProductoController = require('../controllers/imagenProductoController');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// Rutas públicas (sin autenticación)
router.get('/', imagenProductoController.obtenerTodas);
router.get('/producto/:productoId', imagenProductoController.obtenerPorProducto);
router.get('/producto/:productoId/principal', imagenProductoController.obtenerPrincipalPorProducto);
router.get('/:id', imagenProductoController.obtenerPorId);
router.get('/estadisticas', imagenProductoController.obtenerEstadisticas);

// Rutas protegidas (requieren autenticación de administrador)
router.post('/', authMiddleware, adminMiddleware, imagenProductoController.crear);
router.post('/producto/:id_producto/multiples', authMiddleware, adminMiddleware, imagenProductoController.subirMultiplesImagenes);
router.put('/:id', authMiddleware, adminMiddleware, imagenProductoController.actualizar);
router.put('/:id/principal', authMiddleware, adminMiddleware, imagenProductoController.marcarComoPrincipal);
router.put('/producto/:productoId/reordenar', authMiddleware, adminMiddleware, imagenProductoController.reordenarImagenes);
router.delete('/:id', authMiddleware, adminMiddleware, imagenProductoController.eliminar);

module.exports = router;