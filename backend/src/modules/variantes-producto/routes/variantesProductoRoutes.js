const express = require('express');
const router = express.Router();
const varianteProductoController = require('../controllers/varianteProductoController');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// Rutas públicas (sin autenticación)
router.get('/', varianteProductoController.obtenerTodas);
router.get('/producto/:productoId', varianteProductoController.obtenerPorProducto);
router.get('/:id', varianteProductoController.obtenerPorId);
router.get('/:id/verificar-stock', varianteProductoController.verificarStock);
router.get('/stock-bajo', varianteProductoController.obtenerConStockBajo);

// Rutas protegidas (requieren autenticación de administrador)
router.post('/', authMiddleware, adminMiddleware, varianteProductoController.crear);
router.put('/:id', authMiddleware, adminMiddleware, varianteProductoController.actualizar);
router.delete('/:id', authMiddleware, adminMiddleware, varianteProductoController.eliminar);
router.put('/:id/stock', authMiddleware, adminMiddleware, varianteProductoController.actualizarStock);

module.exports = router;