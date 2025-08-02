console.log('�� Verificando importaciones...\n');

try {
  console.log('1️⃣ Verificando modelo EstadoPedido...');
  const EstadoPedido = require('./src/modules/estados-pedido/models/EstadoPedido');
  console.log('✅ EstadoPedido cargado');

  console.log('\n2️⃣ Verificando modelo Pedido...');
  const Pedido = require('./src/modules/pedidos/models/Pedido');
  console.log('✅ Pedido cargado');

  console.log('\n3️⃣ Verificando controlador...');
  const controlador = require('./src/modules/estados-pedido/controllers/estadoPedidoController');
  console.log('✅ Controlador cargado');
  console.log('   Métodos:', Object.keys(controlador));

  console.log('\n4️⃣ Verificando rutas...');
  const rutas = require('./src/modules/estados-pedido/routes/estadosPedidoRoutes');
  console.log('✅ Rutas cargadas');

  console.log('\n✅ Todas las importaciones funcionan correctamente');

} catch (error) {
  console.error('❌ Error en importación:', error.message);
  console.error('Stack:', error.stack);
} 