// Servidor HTTP simple sin dependencias externas
// Ejecutar: node simple-server.js

const http = require('http');
const url = require('url');

// Configuración del servidor
const PORT = 3000;

// Función para manejar las rutas
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Configurar headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar rutas
  switch (path) {
    case '/':
      res.writeHead(200);
      res.end(JSON.stringify({
        mensaje: '¡Bienvenido a la API del Catálogo Gardem!',
        version: '1.0.0',
        estado: 'Activo',
        base_datos: 'gardem_db',
        servidor: 'HTTP Simple'
      }));
      break;
      
    case '/health':
      res.writeHead(200);
      res.end(JSON.stringify({
        estado: 'OK',
        timestamp: new Date().toISOString(),
        servidor: 'HTTP Simple',
        version: '1.0.0'
      }));
      break;
      
    case '/test-db':
      res.writeHead(200);
      res.end(JSON.stringify({
        mensaje: '✅ Servidor funcionando correctamente',
        base_datos: 'gardem_db',
        estado: 'Servidor Activo',
        nota: 'Para probar MySQL, instala las dependencias'
      }));
      break;
      
    default:
      res.writeHead(404);
      res.end(JSON.stringify({
        mensaje: 'Ruta no encontrada',
        ruta: path
      }));
  }
}

// Crear el servidor
const server = http.createServer(handleRequest);

// Iniciar el servidor
server.listen(PORT, () => {
  console.log('🚀 Servidor HTTP simple iniciado');
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Test DB: http://localhost:${PORT}/test-db`);
  console.log('🎯 Base de datos: gardem_db');
  console.log('');
  console.log('💡 Para instalar dependencias completas:');
  console.log('   npm install');
  console.log('   O ejecuta: install-deps.bat');
});

// Manejo de errores
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Puerto ${PORT} ya está en uso`);
    console.log('💡 Cambia el puerto o cierra la aplicación que lo usa');
  } else {
    console.error('❌ Error del servidor:', error.message);
  }
});

// Manejo de cierre
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado');
    process.exit(0);
  });
}); 