const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar conexión a base de datos
const { testConnection } = require('./database/connection');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// CONFIGURACIÓN DE MIDDLEWARE
// =====================================================

// Configuración de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por ventana
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
  }
});
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =====================================================
// RUTAS PRINCIPALES
// =====================================================

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API del Catálogo Gardem',
    version: '1.0.0',
    estado: 'Activo',
    timestamp: new Date().toISOString()
  });
});

// Ruta de health check
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      estado: 'OK',
      timestamp: new Date().toISOString(),
      base_datos: dbConnected ? 'Conectada' : 'Error de conexión',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      estado: 'ERROR',
      mensaje: 'Error en el health check',
      error: error.message
    });
  }
});

// =====================================================
// RUTAS DE MÓDULOS (se importarán cuando se creen)
// =====================================================

// Importar rutas de módulos
app.use('/api/usuarios', require('./modules/usuarios/routes/usuariosRoutes'));
app.use('/api/categorias', require('./modules/categorias/routes/categoriasRoutes'));
app.use('/api/tallas', require('./modules/tallas/routes/tallasRoutes'));
app.use('/api/colores', require('./modules/colores/routes/coloresRoutes'));
app.use('/api/productos', require('./modules/productos/routes/productosRoutes'));
app.use('/api/variantes-producto', require('./modules/variantes-producto/routes/variantesProductoRoutes'));
app.use('/api/imagenes-producto', require('./modules/imagenes-producto/routes/imagenesProductoRoutes'));
app.use('/api/cesta-pedido', require('./modules/cesta-pedido/routes/cestaPedidoRoutes'));
app.use('/api/items-cesta', require('./modules/items-cesta/routes/itemsCestaRoutes'));
app.use('/api/items-pedido', require('./modules/items-pedido/routes/itemsPedidoRoutes'));
app.use('/api/pedidos', require('./modules/pedidos/routes/pedidosRoutes'));
app.use('/api/estados-pedido', require('./modules/estados-pedido/routes/estadosPedidoRoutes'));
// =====================================================
// MANEJO DE ERRORES
// =====================================================

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `La ruta ${req.originalUrl} no existe en esta API`,
    timestamp: new Date().toISOString()
  });
});

// Middleware para manejar errores globales
app.use((error, req, res, next) => {
  console.error('Error en la aplicación:', error);
  
  res.status(error.status || 500).json({
    error: 'Error interno del servidor',
    mensaje: error.message, // Cambiar esto para ver el error real
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// INICIALIZACIÓN DEL SERVIDOR
// =====================================================

async function iniciarServidor() {
  try {
    // Probar conexión a la base de datos
    console.log('🔍 Probando conexión a la base de datos...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos. Verifica la configuración.');
      process.exit(1);
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado exitosamente!');
      console.log(`📡 Puerto: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('=====================================');
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor si este archivo se ejecuta directamente
if (require.main === module) {
  iniciarServidor();
}

module.exports = app; 