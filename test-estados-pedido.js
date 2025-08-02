const EstadoPedido = require('./backend/src/modules/estados-pedido/models/EstadoPedido');
const Pedido = require('./backend/src/modules/pedidos/models/Pedido');
const { executeQuery } = require('./backend/src/database/connection');

async function probarEstadosPedido() {
  console.log('🧪 Iniciando pruebas del módulo EstadosPedido...\n');

  try {
    // Primero, verificar si existen pedidos en la base de datos
    console.log('0. Verificando pedidos existentes...');
    const pedidosExistentes = await executeQuery('SELECT id_pedido, numero_pedido FROM Pedidos LIMIT 5');
    console.log('Pedidos existentes:', pedidosExistentes);

    let pedidoId;
    if (pedidosExistentes.length > 0) {
      pedidoId = pedidosExistentes[0].id_pedido;
      console.log(`✅ Usando pedido existente: ${pedidoId}`);
    } else {
      console.log('❌ No hay pedidos en la base de datos');
      console.log('Por favor, crea un pedido primero o ejecuta el script de verificación de tablas');
      return;
    }

    // Verificar si existen usuarios
    console.log('\n0.1. Verificando usuarios existentes...');
    const usuariosExistentes = await executeQuery('SELECT id_usuario, nombre_usuario FROM Usuarios LIMIT 5');
    console.log('Usuarios existentes:', usuariosExistentes);

    let usuarioId;
    if (usuariosExistentes.length > 0) {
      usuarioId = usuariosExistentes[0].id_usuario;
      console.log(`✅ Usando usuario existente: ${usuarioId}`);
    } else {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    // Datos de prueba usando IDs reales
    const datosPrueba = {
      id_pedido: pedidoId,
      estado: 'confirmado',
      comentario: 'Pedido confirmado por el administrador',
      id_usuario: usuarioId
    };

    console.log('\n1. Creando estado de pedido...');
    const estadoCreado = await EstadoPedido.crear(datosPrueba);
    console.log('✅ Estado creado:', estadoCreado.toPublicObject());

    console.log('\n2. Buscando estado por ID...');
    const estadoEncontrado = await EstadoPedido.buscarPorId(estadoCreado.id_estado_pedido);
    console.log('✅ Estado encontrado:', estadoEncontrado.toPublicObject());

    console.log('\n3. Obteniendo historial de estados del pedido...');
    const historial = await EstadoPedido.obtenerPorPedido(datosPrueba.id_pedido);
    console.log('✅ Historial obtenido:', historial.length, 'estados');

    console.log('\n4. Obteniendo último estado del pedido...');
    const ultimoEstado = await EstadoPedido.obtenerUltimoEstado(datosPrueba.id_pedido);
    console.log('✅ Último estado:', ultimoEstado.toPublicObject());

    console.log('\n5. Obteniendo estados por estado específico...');
    const estadosConfirmados = await EstadoPedido.obtenerPorEstado('confirmado');
    console.log('✅ Estados confirmados:', estadosConfirmados.length);

    console.log('\n6. Obteniendo estados por usuario...');
    const estadosUsuario = await EstadoPedido.obtenerPorUsuario(datosPrueba.id_usuario);
    console.log('✅ Estados del usuario:', estadosUsuario.length);

    console.log('\n7. Obteniendo estadísticas...');
    const estadisticas = await EstadoPedido.obtenerEstadisticas();
    console.log('✅ Estadísticas obtenidas:', estadisticas.length, 'registros');

    console.log('\n8. Obteniendo todos los estados...');
    const todosEstados = await EstadoPedido.obtenerTodos();
    console.log('✅ Total de estados:', todosEstados.length);

    console.log('\n9. Eliminando estado de prueba...');
    const eliminado = await EstadoPedido.eliminar(estadoCreado.id_estado_pedido);
    console.log('✅ Estado eliminado:', eliminado);

    console.log('\n ¡Todas las pruebas del módulo EstadosPedido fueron exitosas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar pruebas
probarEstadosPedido();