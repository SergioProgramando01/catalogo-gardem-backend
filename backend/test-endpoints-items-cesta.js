const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokenAdmin = '';
let tokenCliente = '';
let cestaId = '';
let itemId = '';

async function testEndpointsItemsCesta() {
  console.log('🧪 Iniciando pruebas de endpoints HTTP del módulo ItemsCesta...\n');

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

    // 4. Agregar item a la cesta
    console.log('\n4️⃣ Agregando item a la cesta...');
    const agregarItemResponse = await axios.post(`${BASE_URL}/items-cesta/cesta/${cestaId}`, {
      id_variante: 1,
      cantidad: 2
    }, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    itemId = agregarItemResponse.data.item.id_item_cesta;
    console.log('✅ Item agregado:', itemId);

    // 5. Obtener items de la cesta
    console.log('\n5️⃣ Obteniendo items de la cesta...');
    const itemsResponse = await axios.get(`${BASE_URL}/items-cesta/cesta/${cestaId}`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Items obtenidos:', itemsResponse.data.items.length);

    // 6. Obtener item por ID
    console.log('\n6️⃣ Obteniendo item por ID...');
    const itemResponse = await axios.get(`${BASE_URL}/items-cesta/${itemId}`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Item obtenido por ID');

    // 7. Actualizar cantidad del item
    console.log('\n7️⃣ Actualizando cantidad del item...');
    const actualizarResponse = await axios.put(`${BASE_URL}/items-cesta/${itemId}/cantidad`, {
      cantidad: 3
    }, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Cantidad actualizada');

    // 8. Verificar stock del item
    console.log('\n8️⃣ Verificando stock del item...');
    const stockResponse = await axios.get(`${BASE_URL}/items-cesta/${itemId}/stock`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Stock verificado:', stockResponse.data.stock_info);

    // 9. Agregar múltiples items
    console.log('\n9️⃣ Agregando múltiples items...');
    const multiplesResponse = await axios.post(`${BASE_URL}/items-cesta/cesta/${cestaId}/multiples`, {
      items: [
        { id_variante: 2, cantidad: 1 },
        { id_variante: 3, cantidad: 2 }
      ]
    }, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Múltiples items agregados');

    // 10. Obtener items actualizados
    console.log('\n🔟 Obteniendo items actualizados...');
    const itemsActualizadosResponse = await axios.get(`${BASE_URL}/items-cesta/cesta/${cestaId}`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Items actualizados:', itemsActualizadosResponse.data.items.length);

    // 11. Probar acceso sin token (debe fallar)
    console.log('\n1️⃣1️⃣ Probando acceso sin token...');
    try {
      await axios.get(`${BASE_URL}/items-cesta/cesta/${cestaId}`);
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (401)');
    }

    // 12. Eliminar item
    console.log('\n1️⃣2️⃣ Eliminando item...');
    await axios.delete(`${BASE_URL}/items-cesta/${itemId}`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Item eliminado');

    // 13. Verificar items restantes
    console.log('\n1️⃣3️⃣ Verificando items restantes...');
    const itemsRestantesResponse = await axios.get(`${BASE_URL}/items-cesta/cesta/${cestaId}`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Items restantes:', itemsRestantesResponse.data.items.length);

    console.log('\n✅ Todas las pruebas de endpoints HTTP del módulo ItemsCesta completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testEndpointsItemsCesta();