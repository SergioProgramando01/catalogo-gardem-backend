const ItemPedido = require('./src/modules/items-pedido/models/ItemPedido');
const Pedido = require('./src/modules/pedidos/models/Pedido');
const Usuario = require('./src/modules/usuarios/models/Usuario');

async function testItemsPedido() {
  console.log('🧪 Iniciando pruebas del módulo ItemsPedido...\n');

  try {
    // Obtener un usuario de prueba
    const usuario = await Usuario.buscarPorEmail('cliente@gardem.com');
    if (!usuario) {
      console.log('❌ Usuario de prueba no encontrado. Ejecuta primero: node corregir-contraseñas.js');
      return;
    }

    // Obtener un pedido existente
    const pedidos = await Pedido.obtenerPorUsuario(usuario.id_usuario);
    if (pedidos.length === 0) {
      console.log('❌ No hay pedidos para probar. Crea un pedido primero.');
      return;
    }

    const pedido = pedidos[0];
    console.log('📦 Usando pedido:', pedido.numero_pedido);

    console.log('1️⃣ Obteniendo items por pedido...');
    const itemsPedido = await ItemPedido.obtenerPorPedido(pedido.id_pedido);
    console.log('✅ Items del pedido:', itemsPedido.length);

    if (itemsPedido.length > 0) {
      const primerItem = itemsPedido[0];
      console.log('   Primer item:', primerItem.nombre_producto, '-', primerItem.talla, primerItem.color);

      console.log('\n2️⃣ Buscando item por ID...');
      const itemEncontrado = await ItemPedido.buscarPorId(primerItem.id_item_pedido);
      console.log('✅ Item encontrado:', itemEncontrado.nombre_producto);

      console.log('\n3️⃣ Obteniendo items por usuario...');
      const itemsUsuario = await ItemPedido.obtenerPorUsuario(usuario.id_usuario);
      console.log('✅ Items del usuario:', itemsUsuario.length);

      console.log('\n4️⃣ Obteniendo items por variante...');
      const itemsVariante = await ItemPedido.obtenerPorVariante(primerItem.id_variante);
      console.log('✅ Items de la variante:', itemsVariante.length);

      console.log('\n5️⃣ Obteniendo items por producto...');
      const itemsProducto = await ItemPedido.obtenerPorProducto(primerItem.variante.id_producto);
      console.log('✅ Items del producto:', itemsProducto.length);

      console.log('\n6️⃣ Actualizando item...');
      const itemActualizado = await ItemPedido.actualizar(primerItem.id_item_pedido, {
        cantidad: primerItem.cantidad + 1
      });
      console.log('✅ Item actualizado, nueva cantidad:', itemActualizado.cantidad);

      console.log('\n7️⃣ Obteniendo estadísticas...');
      const estadisticas = await ItemPedido.obtenerEstadisticas();
      console.log('✅ Estadísticas:', estadisticas);

      console.log('\n8️⃣ Obteniendo todos los items (admin)...');
      const todosItems = await ItemPedido.obtenerTodos();
      console.log('✅ Total de items:', todosItems.length);

      console.log('\n9️⃣ Restaurando cantidad original...');
      await ItemPedido.actualizar(primerItem.id_item_pedido, {
        cantidad: primerItem.cantidad
      });
      console.log('✅ Cantidad restaurada');

    } else {
      console.log('⚠️ No hay items en el pedido para probar');
    }

    console.log('\n✅ Todas las pruebas del módulo ItemsPedido completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testItemsPedido(); 