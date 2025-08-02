const Pedido = require('./src/modules/pedidos/models/Pedido');

async function testPedidoSimple() {
  console.log('🧪 Prueba simple del modelo Pedido...\n');

  try {
    console.log('1️⃣ Probando obtenerTodos()...');
    const pedidos = await Pedido.obtenerTodos();
    console.log('✅ Pedidos obtenidos:', pedidos.length);
    
    if (pedidos.length > 0) {
      console.log('   Primer pedido:', pedidos[0].numero_pedido);
    }

    console.log('\n2️⃣ Probando obtenerEstadisticas()...');
    const estadisticas = await Pedido.obtenerEstadisticas();
    console.log('✅ Estadísticas obtenidas:', estadisticas);

    console.log('\n✅ Prueba simple completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar prueba
testPedidoSimple(); 