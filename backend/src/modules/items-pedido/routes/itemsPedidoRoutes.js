const express = require('express');
const router = express.Router();
const itemPedidoController = require('../controllers/itemPedidoController');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// =====================================================
// RUTAS DE ADMINISTRADOR (requieren rol admin)
// =====================================================

// Obtener estadísticas de items (admin)
router.get('/admin/estadisticas', authMiddleware, adminMiddleware, itemPedidoController.obtenerEstadisticas);

// Obtener todos los items (admin)
router.get('/', authMiddleware, adminMiddleware, itemPedidoController.obtenerTodos);

// =====================================================
// RUTAS PROTEGIDAS (requieren autenticación)
// =====================================================

// Obtener mis items de pedidos
router.get('/mis-items', authMiddleware, itemPedidoController.obtenerMisItems);

// Obtener resumen de items por pedido
router.get('/pedido/:pedidoId/resumen', authMiddleware, itemPedidoController.obtenerResumenPorPedido);

// Obtener items por pedido
router.get('/pedido/:pedidoId', authMiddleware, itemPedidoController.obtenerPorPedido);

// Obtener items por variante
router.get('/variante/:varianteId', authMiddleware, itemPedidoController.obtenerPorVariante);

// Obtener items por producto
router.get('/producto/:productoId', authMiddleware, itemPedidoController.obtenerPorProducto);

// =====================================================
// RUTAS CON PARÁMETROS (deben ir al final)
// =====================================================

// Obtener item por ID
router.get('/:itemId', authMiddleware, itemPedidoController.obtenerPorId);

// Actualizar item de pedido
router.put('/:itemId', authMiddleware, itemPedidoController.actualizar);

// Eliminar item de pedido (admin)
router.delete('/:itemId', authMiddleware, adminMiddleware, itemPedidoController.eliminar);

module.exports = router; 