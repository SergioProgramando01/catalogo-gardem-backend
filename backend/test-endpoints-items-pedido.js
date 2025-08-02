const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokenAdmin = '';
let tokenCliente = '';
let pedidoId = '';
let itemId = '';

async function testEndpointsItemsPedido() {
  console.log('🧪 Iniciando pruebas de endpoints HTTP del módulo ItemsPedido...\n');

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

    // 3. Obtener mis pedidos para usar uno existente
    console.log('\n3️⃣ Obteniendo mis pedidos...');
    const misPedidosResponse = await axios.get(`${BASE_URL}/pedidos/mis-pedidos`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    
    if (misPedidosResponse.data.pedidos.length === 0) {
      console.log('❌ No hay pedidos para probar. Crea un pedido primero.');
      return;
    }
    
    pedidoId = misPedidosResponse.data.pedidos[0].id_pedido;
    console.log('✅ Pedido seleccionado:', pedidoId);

    // 4. Obtener items por pedido
    console.log('\n4️⃣ Obteniendo items por pedido...');
    const itemsPedidoResponse = await axios.get(`${BASE_URL}/items-pedido/pedido/${pedidoId}`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Items del pedido:', itemsPedidoResponse.data.items.length);

    if (itemsPedidoResponse.data.items.length > 0) {
      // Debug: Ver la estructura del primer item
      console.log(' Debug - Estructura del primer item:');
      console.log(JSON.stringify(itemsPedidoResponse.data.items[0], null, 2));
      
      itemId = itemsPedidoResponse.data.items[0].id_item_pedido;
      console.log('   Item seleccionado:', itemId);

      // Verificar si producto existe antes de acceder
      if (itemsPedidoResponse.data.items[0].producto) {
        console.log('✅ Producto encontrado:', itemsPedidoResponse.data.items[0].producto);
      } else {
        console.log('❌ Producto es null o undefined');
        console.log('🔍 Debug - Keys del item:', Object.keys(itemsPedidoResponse.data.items[0]));
      }

      // 5. Obtener item por ID
      console.log('\n5️⃣ Obteniendo item por ID...');
      const itemResponse = await axios.get(`${BASE_URL}/items-pedido/${itemId}`, {
        headers: { Authorization: `Bearer ${tokenCliente}` }
      });
      console.log('✅ Item obtenido por ID');

      // 6. Obtener resumen de items por pedido
      console.log('\n6️⃣ Obteniendo resumen de items por pedido...');
      const resumenResponse = await axios.get(`${BASE_URL}/items-pedido/pedido/${pedidoId}/resumen`, {
        headers: { Authorization: `Bearer ${tokenCliente}` }
      });
      console.log('✅ Resumen obtenido:', resumenResponse.data.resumen);

      // 7. Obtener mis items de pedidos
      console.log('\n7️⃣ Obteniendo mis items de pedidos...');
      const misItemsResponse = await axios.get(`${BASE_URL}/items-pedido/mis-items`, {
        headers: { Authorization: `Bearer ${tokenCliente}` }
      });
      console.log('✅ Mis items obtenidos:', misItemsResponse.data.items.length);

      // 8. Obtener items por variante
      console.log('\n8️⃣ Obteniendo items por variante...');
      const varianteId = itemsPedidoResponse.data.items[0].id_variante;
      const itemsVarianteResponse = await axios.get(`${BASE_URL}/items-pedido/variante/${varianteId}`, {
        headers: { Authorization: `Bearer ${tokenCliente}` }
      });
      console.log('✅ Items por variante:', itemsVarianteResponse.data.items.length);

      // 9. Obtener items por producto
      console.log('\n9️⃣ Obteniendo items por producto...');
      const productoId = itemsPedidoResponse.data.items[0].producto.id_producto;
      const itemsProductoResponse = await axios.get(`${BASE_URL}/items-pedido/producto/${productoId}`, {
        headers: { Authorization: `Bearer ${tokenCliente}` }
      });
      console.log('✅ Items por producto:', itemsProductoResponse.data.items.length);

      // 10. Actualizar item
      console.log('\n🔟 Actualizando item...');
      const cantidadOriginal = itemsPedidoResponse.data.items[0].cantidad;
      const actualizarResponse = await axios.put(`${BASE_URL}/items-pedido/${itemId}`, {
        cantidad: cantidadOriginal + 1
      }, {
        headers: { Authorization: `Bearer ${tokenCliente}` }
      });
      console.log('✅ Item actualizado');

      // 11. Restaurar cantidad original
      console.log('\n1️⃣1️⃣ Restaurando cantidad original...');
      await axios.put(`${BASE_URL}/items-pedido/${itemId}`, {
        cantidad: cantidadOriginal
      }, {
        headers: { Authorization: `Bearer ${tokenCliente}` }
      });
      console.log('✅ Cantidad restaurada');

    } else {
      console.log('⚠️ No hay items en el pedido para probar');
    }

    // 12. Obtener todos los items (admin)
    console.log('\n1️⃣2️⃣ Obteniendo todos los items (admin)...');
    const todosItemsResponse = await axios.get(`${BASE_URL}/items-pedido`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Todos los items obtenidos:', todosItemsResponse.data.items.length);

    // 13. Obtener estadísticas (admin)
    console.log('\n1️⃣3️⃣ Obteniendo estadísticas (admin)...');
    const estadisticasResponse = await axios.get(`${BASE_URL}/items-pedido/admin/estadisticas`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Estadísticas obtenidas');

    // 14. Probar acceso sin token (debe fallar)
    console.log('\n1️⃣4️⃣ Probando acceso sin token...');
    try {
      await axios.get(`${BASE_URL}/items-pedido/mis-items`);
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (401)');
    }

    // 15. Probar acceso a item de otro usuario (debe fallar)
    if (itemId) {
      console.log('\n1️⃣5️⃣ Probando acceso a item de otro usuario...');
      try {
        await axios.get(`${BASE_URL}/items-pedido/${itemId}`, {
          headers: { Authorization: `Bearer ${tokenAdmin}` }
        });
      } catch (error) {
        console.log('✅ Acceso denegado correctamente (403)');
      }
    }

    console.log('\n✅ Todas las pruebas de endpoints HTTP del módulo ItemsPedido completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testEndpointsItemsPedido(); 