const express = require('express');
const router = express.Router();
const estadoPedidoController = require('../controllers/estadoPedidoController');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// =====================================================
// RUTAS DE ADMINISTRADOR (requieren rol admin) - DEBEN IR PRIMERO
// =====================================================

// Obtener todos los estados (admin)
router.get('/', authMiddleware, adminMiddleware, estadoPedidoController.obtenerTodos);

// Obtener estadísticas de estados (admin)
router.get('/admin/estadisticas', authMiddleware, adminMiddleware, estadoPedidoController.obtenerEstadisticas);

// =====================================================
// RUTAS PROTEGIDAS (requieren autenticación)
// =====================================================

// Crear nuevo estado de pedido
router.post('/', authMiddleware, estadoPedidoController.crear);

// Obtener mis estados (cliente)
router.get('/mis-estados', authMiddleware, estadoPedidoController.obtenerMisEstados);

// Obtener estados por estado específico
router.get('/estado/:estado', authMiddleware, estadoPedidoController.obtenerPorEstado);

// =====================================================
// RUTAS CON PARÁMETROS (deben ir al final)
// =====================================================

// Obtener estado por ID (solo propietario o admin)
router.get('/:estadoId', authMiddleware, estadoPedidoController.obtenerPorId);

// Obtener historial de estados de un pedido (solo propietario o admin)
router.get('/pedido/:pedidoId', authMiddleware, estadoPedidoController.obtenerPorPedido);

// Obtener último estado de un pedido (solo propietario o admin)
router.get('/pedido/:pedidoId/ultimo', authMiddleware, estadoPedidoController.obtenerUltimoEstado);

// Eliminar estado (admin)
router.delete('/:estadoId', authMiddleware, adminMiddleware, estadoPedidoController.eliminar);

module.exports = router;