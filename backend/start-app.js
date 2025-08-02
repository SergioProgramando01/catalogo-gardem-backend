const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./src/database/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
});
app.use(limiter);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: '¡Bienvenido a la API del Catálogo Gardem!',
    version: '1.0.0',
    estado: 'Activo',
    base_datos: 'gardem_db'
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    res.json({
      estado: 'OK',
      timestamp: new Date().toISOString(),
      base_datos: dbStatus ? 'Conectada' : 'Error de conexión',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      estado: 'ERROR',
      timestamp: new Date().toISOString(),
      base_datos: 'Error de conexión',
      error: error.message
    });
  }
});

// Ruta de prueba de conexión
app.get('/test-db', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    if (dbStatus) {
      res.json({
        mensaje: '✅ Conexión a la base de datos exitosa',
        base_datos: 'gardem_db',
        estado: 'Conectado'
      });
    } else {
      res.status(500).json({
        mensaje: '❌ Error al conectar con la base de datos',
        base_datos: 'gardem_db',
        estado: 'Error'
      });
    }
  } catch (error) {
    res.status(500).json({
      mensaje: '❌ Error al conectar con la base de datos',
      error: error.message,
      estado: 'Error'
    });
  }
});

// Importar rutas de módulos
const usuariosRoutes = require('./src/modules/usuarios/routes/usuariosRoutes');

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes);

// Ruta de prueba de módulos
app.get('/api/modulos', (req, res) => {
  res.json({
    mensaje: 'Módulos disponibles',
    modulos: [
      {
        nombre: 'usuarios',
        rutas: [
          'POST /api/usuarios/registrar',
          'POST /api/usuarios/login',
          'GET /api/usuarios/perfil',
          'PUT /api/usuarios/cambiar-contraseña',
          'GET /api/usuarios/verificar-token',
          'GET /api/usuarios (admin)',
          'GET /api/usuarios/:id (admin)',
          'PUT /api/usuarios/:id (admin)',
          'DELETE /api/usuarios/:id (admin)'
        ]
      }
    ]
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    mensaje: 'Ruta no encontrada',
    ruta: req.originalUrl
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

// Función para iniciar el servidor
async function iniciarServidor() {
  try {
    console.log('🚀 Iniciando servidor...');
    
    // Probar conexión a la base de datos
    console.log('🔍 Probando conexión a la base de datos...');
    const dbStatus = await testConnection();
    
    if (dbStatus) {
      console.log('✅ Conexión a la base de datos establecida');
    } else {
      console.log('❌ Error al conectar con la base de datos');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 Test DB: http://localhost:${PORT}/test-db`);
      console.log('🎯 Base de datos: gardem_db');
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
iniciarServidor(); 