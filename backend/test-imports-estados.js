console.log('🧪 Probando importaciones del módulo EstadosPedido...\n');

try {
  console.log('1️⃣ Importando modelo EstadoPedido...');
  const EstadoPedido = require('./src/modules/estados-pedido/models/EstadoPedido');
  console.log('✅ Modelo EstadoPedido importado correctamente');

  console.log('\n2️⃣ Importando controlador EstadoPedidoController...');
  const estadoPedidoController = require('./src/modules/estados-pedido/controllers/estadoPedidoController');
  console.log('✅ Controlador EstadoPedidoController importado correctamente');

  console.log('\n3️⃣ Verificando métodos del controlador...');
  console.log('obtenerMisEstados:', typeof estadoPedidoController.obtenerMisEstados);
  console.log('obtenerPorPedido:', typeof estadoPedidoController.obtenerPorPedido);
  console.log('obtenerPorId:', typeof estadoPedidoController.obtenerPorId);
  console.log('obtenerTodos:', typeof estadoPedidoController.obtenerTodos);
  console.log('obtenerPorEstado:', typeof estadoPedidoController.obtenerPorEstado);
  console.log('crear:', typeof estadoPedidoController.crear);
  console.log('actualizar:', typeof estadoPedidoController.actualizar);
  console.log('eliminar:', typeof estadoPedidoController.eliminar);

  console.log('\n4️⃣ Importando rutas...');
  const estadosPedidoRoutes = require('./src/modules/estados-pedido/routes/estadosPedidoRoutes');
  console.log('✅ Rutas importadas correctamente');

  console.log('\n✅ Todas las importaciones funcionan correctamente!');

} catch (error) {
  console.error('❌ Error en las importaciones:', error.message);
  console.error('Stack trace:', error.stack);
} 