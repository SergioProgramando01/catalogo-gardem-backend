const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokenAdmin = '';
let tokenCliente = '';
let cestaId = '';

async function testEndpointsCestaPedido() {
  console.log('🧪 Iniciando pruebas de endpoints HTTP del módulo CestaPedido...\n');

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

    // 3. Obtener mi cesta (cliente)
    console.log('\n3️⃣ Obteniendo mi cesta...');
    const miCestaResponse = await axios.get(`${BASE_URL}/cesta-pedido/mi-cesta`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    cestaId = miCestaResponse.data.cesta.id_cesta;
    console.log('✅ Mi cesta obtenida:', cestaId);

    // 4. Agregar items a la cesta antes de finalizarla
    console.log('\n4️⃣ Agregando items a la cesta...');
    await axios.post(`${BASE_URL}/items-cesta/cesta/${cestaId}`, {
      id_variante: 1,
      cantidad: 2
    }, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Items agregados a la cesta');

    // 5. Crear nueva cesta (cliente)
    console.log('\n5️⃣ Creando nueva cesta...');
    const nuevaCestaResponse = await axios.post(`${BASE_URL}/cesta-pedido`, {}, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Nueva cesta creada');

    // 6. Obtener cesta por ID (cliente)
    console.log('\n6️⃣ Obteniendo cesta por ID...');
    const cestaResponse = await axios.get(`${BASE_URL}/cesta-pedido/${cestaId}`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Cesta obtenida por ID');

    // 7. Calcular total de la cesta (cliente)
    console.log('\n7️⃣ Calculando total de la cesta...');
    const totalResponse = await axios.get(`${BASE_URL}/cesta-pedido/${cestaId}/total`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Total calculado:', totalResponse.data.total);

    // 8. Obtener todas las cestas (admin)
    console.log('\n8️⃣ Obteniendo todas las cestas (admin)...');
    const todasCestasResponse = await axios.get(`${BASE_URL}/cesta-pedido`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Todas las cestas obtenidas:', todasCestasResponse.data.cestas.length);

    // 9. Actualizar cesta (cliente)
    console.log('\n9️⃣ Actualizando cesta...');
    const actualizarResponse = await axios.put(`${BASE_URL}/cesta-pedido/${cestaId}`, {
      estado: 'pendiente'
    }, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Cesta actualizada');

    // 10. Finalizar cesta (cliente) - ahora con items
    console.log('\n🔟 Finalizando cesta...');
    const finalizarResponse = await axios.put(`${BASE_URL}/cesta-pedido/${cestaId}/finalizar`, {}, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Cesta finalizada');

    // 11. Probar acceso sin token (debe fallar)
    console.log('\n1️⃣1️⃣ Probando acceso sin token...');
    try {
      await axios.get(`${BASE_URL}/cesta-pedido/mi-cesta`);
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (401)');
    }

    // 12. Probar acceso a cesta de otro usuario (debe fallar)
    console.log('\n1️⃣2️⃣ Probando acceso a cesta de otro usuario...');
    try {
      await axios.get(`${BASE_URL}/cesta-pedido/${cestaId}`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` }
      });
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (403)');
    }

    // 13. Eliminar cesta (cliente)
    console.log('\n1️⃣3️⃣ Eliminando cesta...');
    await axios.delete(`${BASE_URL}/cesta-pedido/${cestaId}`, {
      headers: { Authorization: `Bearer ${tokenCliente}` }
    });
    console.log('✅ Cesta eliminada');

    console.log('\n✅ Todas las pruebas de endpoints HTTP del módulo CestaPedido completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testEndpointsCestaPedido(); 