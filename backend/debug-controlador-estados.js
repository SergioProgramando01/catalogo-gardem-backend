console.log('🔍 Depurando el controlador EstadoPedidoController...\n');

try {
  console.log('1️⃣ Importando el controlador...');
  const estadoPedidoController = require('./src/modules/estados-pedido/controllers/estadoPedidoController');
  
  console.log('2️⃣ Verificando el tipo de exportación...');
  console.log('Tipo de estadoPedidoController:', typeof estadoPedidoController);
  console.log('Es una instancia:', estadoPedidoController instanceof Object);
  
  console.log('3️⃣ Verificando métodos individuales...');
  console.log('obtenerMisEstados:', typeof estadoPedidoController.obtenerMisEstados);
  console.log('obtenerPorPedido:', typeof estadoPedidoController.obtenerPorPedido);
  console.log('obtenerPorId:', typeof estadoPedidoController.obtenerPorId);
  console.log('obtenerTodos:', typeof estadoPedidoController.obtenerTodos);
  console.log('obtenerPorEstado:', typeof estadoPedidoController.obtenerPorEstado);
  console.log('crear:', typeof estadoPedidoController.crear);
  console.log('actualizar:', typeof estadoPedidoController.actualizar);
  console.log('eliminar:', typeof estadoPedidoController.eliminar);
  
  console.log('4️⃣ Verificando propiedades del objeto...');
  console.log('Propiedades disponibles:', Object.keys(estadoPedidoController));
  
  console.log('5️⃣ Verificando si es una clase...');
  console.log('Constructor:', estadoPedidoController.constructor);
  console.log('Nombre del constructor:', estadoPedidoController.constructor.name);
  
  console.log('6️⃣ Verificando métodos del prototipo...');
  console.log('Métodos del prototipo:', Object.getOwnPropertyNames(Object.getPrototypeOf(estadoPedidoController)));
  
} catch (error) {
  console.error('❌ Error en la depuración:', error.message);
  console.error('Stack trace:', error.stack);
} 