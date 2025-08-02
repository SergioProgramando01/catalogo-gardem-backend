const express = require('express');
const router = express.Router();
const itemCestaController = require('../controllers/itemCestaController');
const authService = require('../../usuarios/services/authService');

// Middleware de autenticación
const authMiddleware = authService.middlewareAuth();

// Ruta para obtener todos los items de cesta (admin)
router.get('/', authMiddleware, itemCestaController.obtenerTodos);

// Rutas protegidas (requieren autenticación)
router.get('/cesta/:cestaId', authMiddleware, itemCestaController.obtenerPorCesta);
router.get('/:id', authMiddleware, itemCestaController.obtenerPorId);
router.post('/cesta/:cestaId', authMiddleware, itemCestaController.agregar);
router.post('/cesta/:cestaId/multiples', authMiddleware, itemCestaController.agregarMultiples);
router.put('/:id/cantidad', authMiddleware, itemCestaController.actualizarCantidad);
router.delete('/:id', authMiddleware, itemCestaController.eliminar);
router.get('/:id/stock', authMiddleware, itemCestaController.verificarStock);

module.exports = router; 