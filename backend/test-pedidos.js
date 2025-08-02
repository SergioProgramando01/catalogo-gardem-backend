const Pedido = require('./src/modules/pedidos/models/Pedido');
const CestaPedido = require('./src/modules/cesta-pedido/models/CestaPedido');
const Usuario = require('./src/modules/usuarios/models/Usuario');

async function testPedidos() {
  console.log('🧪 Iniciando pruebas del módulo Pedidos...\n');

  try {
    // Obtener un usuario de prueba
    const usuario = await Usuario.buscarPorEmail('cliente@gardem.com');
    if (!usuario) {
      console.log('❌ Usuario de prueba no encontrado. Ejecuta primero: node corregir-contraseñas.js');
      return;
    }

    // Crear una cesta de prueba con items
    const cesta = await CestaPedido.crear(usuario.id_usuario);
    console.log('📦 Cesta de prueba creada:', cesta.id_cesta);

    // Agregar items a la cesta
    const ItemCesta = require('./src/modules/items-cesta/models/ItemCesta');
    await ItemCesta.agregar(cesta.id_cesta, 1, 2); // variante 1, cantidad 2
    await ItemCesta.agregar(cesta.id_cesta, 2, 1); // variante 2, cantidad 1
    console.log('✅ Items agregados a la cesta');

    console.log('1️⃣ Creando pedido desde cesta...');
    const pedido = await Pedido.crearDesdeCesta(cesta.id_cesta, {
      direccion_entrega: 'Calle 123 #45-67, Bogotá',
      telefono_contacto: '3001234567',
      notas: 'Entregar en la portería'
    });
    console.log('✅ Pedido creado:', pedido.numero_pedido);

    console.log('\n2️⃣ Buscando pedido por ID...');
    const pedidoEncontrado = await Pedido.buscarPorId(pedido.id_pedido);
    console.log('✅ Pedido encontrado:', pedidoEncontrado.numero_pedido);

    console.log('\n3️⃣ Obteniendo pedidos por usuario...');
    const pedidosUsuario = await Pedido.obtenerPorUsuario(usuario.id_usuario);
    console.log('✅ Pedidos del usuario:', pedidosUsuario.length);

    console.log('\n4️⃣ Actualizando estado del pedido...');
    const pedidoActualizado = await Pedido.actualizarEstado(pedido.id_pedido, 'confirmado', 'Pedido confirmado por el administrador');
    console.log('✅ Estado actualizado:', pedidoActualizado.estado);

    console.log('\n5️⃣ Obteniendo todos los pedidos...');
    const todosPedidos = await Pedido.obtenerTodos();
    console.log('✅ Total de pedidos:', todosPedidos.length);

    console.log('\n6️⃣ Obteniendo estadísticas...');
    const estadisticas = await Pedido.obtenerEstadisticas();
    console.log('✅ Estadísticas:', estadisticas);

    console.log('\n7️⃣ Cancelando pedido...');
    const pedidoCancelado = await Pedido.actualizarEstado(pedido.id_pedido, 'cancelado', 'Pedido cancelado por el cliente');
    console.log('✅ Pedido cancelado:', pedidoCancelado.estado);

    console.log('\n8️⃣ Verificando historial de estados...');
    const pedidoConHistorial = await Pedido.buscarPorId(pedido.id_pedido);
    console.log('✅ Estados en historial:', pedidoConHistorial.estados.length);

    console.log('\n9️⃣ Verificando items del pedido...');
    console.log('✅ Items en pedido:', pedidoConHistorial.items.length);

    console.log('\n�� Limpiando datos de prueba...');
    await Pedido.eliminar(pedido.id_pedido);
    console.log('✅ Pedido eliminado');

    console.log('\n✅ Todas las pruebas del módulo Pedidos completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testPedidos(); 