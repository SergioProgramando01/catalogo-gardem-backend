const express = require('express');
const router = express.Router();
const cestaPedidoController = require('../controllers/cestaPedidoController');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();
const adminMiddleware = authService.middlewareAdmin();

// Rutas protegidas (requieren autenticación)
router.get('/mi-cesta', authMiddleware, cestaPedidoController.obtenerMiCesta);
router.post('/', authMiddleware, cestaPedidoController.crear);
router.get('/:id', authMiddleware, cestaPedidoController.obtenerPorId);
router.put('/:id', authMiddleware, cestaPedidoController.actualizar);
router.delete('/:id', authMiddleware, cestaPedidoController.eliminar);
router.delete('/:id/vaciar', authMiddleware, cestaPedidoController.vaciar);
router.put('/:id/finalizar', authMiddleware, cestaPedidoController.finalizar);
router.get('/:id/total', authMiddleware, cestaPedidoController.calcularTotal);

// Rutas solo para administradores
router.get('/', authMiddleware, adminMiddleware, cestaPedidoController.obtenerTodas);

module.exports = router; 