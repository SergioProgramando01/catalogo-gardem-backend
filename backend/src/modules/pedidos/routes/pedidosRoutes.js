const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// =====================================================
// RUTAS DE ADMINISTRADOR (requieren rol admin) - DEBEN IR PRIMERO
// =====================================================

// Obtener todos los pedidos (admin) - NECESITA AMBOS MIDDLEWARES
router.get('/', authMiddleware, adminMiddleware, pedidoController.obtenerTodos);

// Obtener estadísticas de pedidos (admin) - NECESITA AMBOS MIDDLEWARES
router.get('/admin/estadisticas', authMiddleware, adminMiddleware, pedidoController.obtenerEstadisticas);

// =====================================================
// RUTAS PROTEGIDAS (requieren autenticación)
// =====================================================

// Crear pedido desde cesta
router.post('/cesta/:cestaId', authMiddleware, pedidoController.crearDesdeCesta);

// Obtener mis pedidos
router.get('/mis-pedidos', authMiddleware, pedidoController.obtenerMisPedidos);

// Obtener pedidos por estado
router.get('/estado/:estado', authMiddleware, pedidoController.obtenerPorEstado);

// =====================================================
// RUTAS CON PARÁMETROS (deben ir al final)
// =====================================================

// Obtener pedido por ID (solo propietario o admin)
router.get('/:pedidoId', authMiddleware, pedidoController.obtenerPorId);

// Actualizar estado del pedido (solo propietario o admin)
router.put('/:pedidoId/estado', authMiddleware, pedidoController.actualizarEstado);

// Obtener historial de estados del pedido (solo propietario o admin)
router.get('/:pedidoId/estados', authMiddleware, pedidoController.obtenerHistorialEstados);

// Cancelar pedido (solo propietario o admin)
router.put('/:pedidoId/cancelar', authMiddleware, pedidoController.cancelarPedido);

// Eliminar pedido (admin) - NECESITA AMBOS MIDDLEWARES
router.delete('/:pedidoId', authMiddleware, adminMiddleware, pedidoController.eliminar);

module.exports = router; 