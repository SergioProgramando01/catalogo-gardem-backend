const express = require('express');
const pedidosRoutes = require('./src/modules/pedidos/routes/pedidosRoutes');

async function testRutasPedido() {
  console.log('🧪 Prueba de las rutas del módulo Pedidos...\n');

  try {
    // Crear una aplicación Express de prueba
    const app = express();
    app.use(express.json());
    
    // Registrar las rutas
    app.use('/api/pedidos', pedidosRoutes);
    
    console.log('✅ Rutas registradas correctamente');
    
    // Verificar que las rutas están disponibles
    console.log('\n�� Rutas disponibles:');
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        console.log(`   ${Object.keys(middleware.route.methods).join(',').toUpperCase()} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        console.log('   Router middleware encontrado');
      }
    });

    console.log('\n✅ Prueba de rutas completada!');

  } catch (error) {
    console.error('❌ Error en la prueba de rutas:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar prueba
testRutasPedido();