console.log('🔍 Probando importación del controlador en las rutas...\n');

try {
  console.log('1️⃣ Importando controlador directamente...');
  const estadoPedidoController = require('./src/modules/estados-pedido/controllers/estadoPedidoController');
  console.log('✅ Controlador importado directamente');

  console.log('\n2️⃣ Verificando método obtenerPorEstado...');
  console.log('obtenerPorEstado existe:', typeof estadoPedidoController.obtenerPorEstado === 'function');
  console.log('obtenerPorEstado valor:', estadoPedidoController.obtenerPorEstado);

  console.log('\n3️⃣ Verificando todos los métodos...');
  const metodos = ['obtenerMisEstados', 'obtenerPorPedido', 'obtenerPorEstado', 'obtenerTodos', 'obtenerPorId', 'crear', 'actualizar', 'eliminar'];
  
  metodos.forEach(metodo => {
    console.log(`${metodo}:`, typeof estadoPedidoController[metodo] === 'function' ? '✅' : '❌');
  });

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack trace:', error.stack);
} 