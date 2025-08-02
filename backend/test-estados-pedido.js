const EstadoPedido = require('./src/modules/estados-pedido/models/EstadoPedido');

async function testEstadosPedido() {
  console.log('🧪 Iniciando pruebas directas del módulo EstadosPedido...\n');

  try {
    // 1. Crear estado de pedido
    console.log('1️⃣ Creando estado de pedido...');
    const datosEstado = {
      id_pedido: 1,
      estado: 'pendiente',
      comentario: 'Pedido creado por el cliente',
      id_usuario: 2
    };
    
    const nuevoEstado = await EstadoPedido.crear(datosEstado);
    console.log('✅ Estado creado:', nuevoEstado.toPublicObject());

    // 2. Buscar estado por ID
    console.log('\n2️⃣ Buscando estado por ID...');
    const estadoEncontrado = await EstadoPedido.buscarPorId(nuevoEstado.id_estado_pedido);
    console.log('✅ Estado encontrado:', estadoEncontrado.toPublicObject());

    // 3. Obtener estados por pedido
    console.log('\n3️⃣ Obteniendo estados por pedido...');
    const estadosPedido = await EstadoPedido.obtenerPorPedido(1);
    console.log('✅ Estados del pedido:', estadosPedido.length);
    estadosPedido.forEach((estado, index) => {
      console.log(`   ${index + 1}. ${estado.estado} - ${estado.comentario}`);
    });

    // 4. Obtener estados por usuario
    console.log('\n4️⃣ Obteniendo estados por usuario...');
    const estadosUsuario = await EstadoPedido.obtenerPorUsuario(2);
    console.log('✅ Estados del usuario:', estadosUsuario.length);

    // 5. Obtener todos los estados
    console.log('\n5️⃣ Obteniendo todos los estados...');
    const todosEstados = await EstadoPedido.obtenerTodos();
    console.log('✅ Total de estados:', todosEstados.length);

    // 6. Obtener estadísticas
    console.log('\n6️⃣ Obteniendo estadísticas...');
    const estadisticas = await EstadoPedido.obtenerEstadisticas();
    console.log('✅ Estadísticas:', estadisticas);

    // 7. Obtener estados por tipo
    console.log('\n7️⃣ Obteniendo estados por tipo...');
    const estadosPendientes = await EstadoPedido.obtenerPorEstado('pendiente');
    console.log('✅ Estados pendientes:', estadosPendientes.length);

    // 8. Actualizar estado
    console.log('\n8️⃣ Actualizando estado...');
    const estadoActualizado = await EstadoPedido.actualizar(nuevoEstado.id_estado_pedido, {
      estado: 'confirmado',
      comentario: 'Pedido confirmado por el administrador'
    });
    console.log('✅ Estado actualizado:', estadoActualizado.toPublicObject());

    // 9. Crear otro estado para el mismo pedido
    console.log('\n9️⃣ Creando segundo estado...');
    const segundoEstado = await EstadoPedido.crear({
      id_pedido: 1,
      estado: 'enviado',
      comentario: 'Pedido enviado por correo',
      id_usuario: 1
    });
    console.log('✅ Segundo estado creado:', segundoEstado.toPublicObject());

    // 10. Verificar historial actualizado
    console.log('\n�� Verificando historial actualizado...');
    const historialActualizado = await EstadoPedido.obtenerPorPedido(1);
    console.log('✅ Historial actualizado:', historialActualizado.length, 'estados');
    historialActualizado.forEach((estado, index) => {
      console.log(`   ${index + 1}. ${estado.estado} - ${estado.comentario} (${estado.fecha_cambio})`);
    });

    console.log('\n✅ Todas las pruebas directas del módulo EstadosPedido completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testEstadosPedido(); 