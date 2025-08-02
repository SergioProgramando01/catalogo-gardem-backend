const ItemCesta = require('./src/modules/items-cesta/models/ItemCesta');
const CestaPedido = require('./src/modules/cesta-pedido/models/CestaPedido');
const Usuario = require('./src/modules/usuarios/models/Usuario');

async function testItemsCesta() {
  console.log('🧪 Iniciando pruebas del módulo ItemsCesta...\n');

  try {
    // Obtener un usuario de prueba
    const usuario = await Usuario.buscarPorEmail('cliente@gardem.com');
    if (!usuario) {
      console.log('❌ Usuario de prueba no encontrado. Ejecuta primero: node corregir-contraseñas.js');
      return;
    }

    // Crear una cesta de prueba
    const cesta = await CestaPedido.crear(usuario.id_usuario);
    console.log('📦 Cesta de prueba creada:', cesta.id_cesta);

    console.log('1️⃣ Agregando item a la cesta...');
    const nuevoItem = await ItemCesta.agregar(cesta.id_cesta, 1, 2); // variante 1, cantidad 2
    console.log('✅ Item agregado:', nuevoItem.toPublicObject());

    console.log('\n2️⃣ Buscando item por ID...');
    const itemEncontrado = await ItemCesta.buscarPorId(nuevoItem.id_item_cesta);
    console.log('✅ Item encontrado:', itemEncontrado.toPublicObject());

    console.log('\n3️⃣ Obteniendo items por cesta...');
    const itemsCesta = await ItemCesta.obtenerPorCesta(cesta.id_cesta);
    console.log('✅ Items de la cesta:', itemsCesta.length);

    console.log('\n4️⃣ Actualizando cantidad del item...');
    const itemActualizado = await ItemCesta.actualizarCantidad(nuevoItem.id_item_cesta, 3);
    console.log('✅ Cantidad actualizada:', itemActualizado.toPublicObject());

    console.log('\n5️⃣ Verificando stock del item...');
    const stockInfo = await ItemCesta.verificarStock(nuevoItem.id_item_cesta);
    console.log('✅ Información de stock:', stockInfo);

    console.log('\n6️⃣ Agregando otro item...');
    const segundoItem = await ItemCesta.agregar(cesta.id_cesta, 2, 1); // variante 2, cantidad 1
    console.log('✅ Segundo item agregado');

    console.log('\n7️⃣ Obteniendo items actualizados...');
    const itemsActualizados = await ItemCesta.obtenerPorCesta(cesta.id_cesta);
    console.log('✅ Total de items:', itemsActualizados.length);

    console.log('\n8️⃣ Eliminando primer item...');
    await ItemCesta.eliminar(nuevoItem.id_item_cesta);
    console.log('✅ Primer item eliminado');

    console.log('\n9️⃣ Verificando items restantes...');
    const itemsRestantes = await ItemCesta.obtenerPorCesta(cesta.id_cesta);
    console.log('✅ Items restantes:', itemsRestantes.length);

    console.log('\n�� Limpiando datos de prueba...');
    await CestaPedido.eliminar(cesta.id_cesta);
    console.log('✅ Cesta eliminada');

    console.log('\n✅ Todas las pruebas del módulo ItemsCesta completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testItemsCesta(); 