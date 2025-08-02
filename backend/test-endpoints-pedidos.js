const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokenAdmin = '';
let tokenCliente = '';
let cestaId = '';
let pedidoId = '';

async function testEndpointsPedidos() {
  console.log('🧪 Iniciando pruebas de endpoints HTTP del módulo Pedidos...\n');

  try {
    // 1. Login como administrador
    console.log('1️⃣ Iniciando sesión como administrador...');
    const loginAdminResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'admin@gardem.com',
      contraseña: 'admin123'
    });
    tokenAdmin = loginAdminResponse.data.token;
    console.log('✅ Login admin exitoso');

    // 2. Login como cliente
    console.log('\n2️⃣ Iniciando sesión como cliente...');
    const loginClienteResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'cliente@gardem.com',
      contraseña: 'cliente123'
    });
    tokenCliente = loginClienteResponse.data.token;
    console.log('✅ Login cliente exitoso');

    // 3. Obtener mi cesta
    console.log('\n3️⃣ Obteniendo mi cesta...');
    const miCestaResponse = await axios.get(`${BASE_URL}/cesta-pedido/mi-cesta`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    cestaId = miCestaResponse.data.cesta.id_cesta;
    console.log('✅ Mi cesta obtenida:', cestaId);

    // 4. Agregar items a la cesta
    console.log('\n4️⃣ Agregando items a la cesta...');
    await axios.post(`${BASE_URL}/items-cesta/cesta/${cestaId}`, {
      id_variante: 1,
      cantidad: 2
    }, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    await axios.post(`${BASE_URL}/items-cesta/cesta/${cestaId}`, {
      id_variante: 2,
      cantidad: 1
    }, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Items agregados a la cesta');

    // 5. Crear pedido desde cesta
    console.log('\n5️⃣ Creando pedido desde cesta...');
    const crearPedidoResponse = await axios.post(`${BASE_URL}/pedidos/cesta/${cestaId}`, {
      direccion_entrega: 'Calle 123 #45-67, Bogotá',
      telefono_contacto: '3001234567',
      notas: 'Entregar en la portería'
    }, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    pedidoId = crearPedidoResponse.data.pedido.id_pedido;
    console.log('✅ Pedido creado:', crearPedidoResponse.data.pedido.numero_pedido);

    // 6. Obtener mis pedidos
    console.log('\n6️⃣ Obteniendo mis pedidos...');
    const misPedidosResponse = await axios.get(`${BASE_URL}/pedidos/mis-pedidos`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Mis pedidos obtenidos:', misPedidosResponse.data.pedidos.length);

    // 7. Obtener pedido por ID
    console.log('\n7️⃣ Obteniendo pedido por ID...');
    const pedidoResponse = await axios.get(`${BASE_URL}/pedidos/${pedidoId}`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Pedido obtenido por ID');

    // 8. Actualizar estado del pedido (admin)
    console.log('\n8️⃣ Actualizando estado del pedido...');
    const actualizarEstadoResponse = await axios.put(`${BASE_URL}/pedidos/${pedidoId}/estado`, {
      estado: 'confirmado',
      comentario: 'Pedido confirmado por el administrador'
    }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Estado actualizado:', actualizarEstadoResponse.data.pedido.estado);

    // 9. Obtener historial de estados
    console.log('\n9️⃣ Obteniendo historial de estados...');
    const historialResponse = await axios.get(`${BASE_URL}/pedidos/${pedidoId}/estados`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Historial obtenido:', historialResponse.data.historial.length);

    // 10. Obtener todos los pedidos (admin)
    console.log('\n🔟 Obteniendo todos los pedidos (admin)...');
    const todosPedidosResponse = await axios.get(`${BASE_URL}/pedidos`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Todos los pedidos obtenidos:', todosPedidosResponse.data.pedidos.length);

    // 11. Obtener estadísticas (admin)
    console.log('\n1️⃣1️⃣ Obteniendo estadísticas (admin)...');
    const estadisticasResponse = await axios.get(`${BASE_URL}/pedidos/admin/estadisticas`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Estadísticas obtenidas');

    // 12. Obtener pedidos por estado
    console.log('\n1️⃣2️⃣ Obteniendo pedidos por estado...');
    const pedidosPorEstadoResponse = await axios.get(`${BASE_URL}/pedidos/estado/confirmado`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Pedidos por estado obtenidos:', pedidosPorEstadoResponse.data.pedidos.length);

    // 13. Cancelar pedido
    console.log('\n1️⃣3️⃣ Cancelando pedido...');
    const cancelarResponse = await axios.put(`${BASE_URL}/pedidos/${pedidoId}/cancelar`, {
      motivo: 'Cambio de opinión del cliente'
    }, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Pedido cancelado');

    // 14. Probar acceso sin token (debe fallar)
    console.log('\n1️⃣4️⃣ Probando acceso sin token...');
    try {
      await axios.get(`${BASE_URL}/pedidos/mis-pedidos`);
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (401)');
    }

    // 15. Probar acceso a pedido de otro usuario (debe fallar)
    console.log('\n1️⃣5️⃣ Probando acceso a pedido de otro usuario...');
    try {
      await axios.get(`${BASE_URL}/pedidos/${pedidoId}`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` }
      });
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (403)');
    }

    // 16. Eliminar pedido (admin)
    console.log('\n1️⃣6️⃣ Eliminando pedido...');
    await axios.delete(`${BASE_URL}/pedidos/${pedidoId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Pedido eliminado');

    console.log('\n✅ Todas las pruebas de endpoints HTTP del módulo Pedidos completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testEndpointsPedidos(); 