const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokenAdmin = '';
let tokenCliente = '';

async function testEndpointsVariantesProducto() {
  console.log('🧪 Iniciando pruebas de endpoints HTTP del módulo VariantesProducto...\n');

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
      password: 'cliente123'
    });
    tokenCliente = loginClienteResponse.data.token;
    console.log('✅ Login cliente exitoso');

    // 3. Obtener todas las variantes (público)
    console.log('\n3️⃣ Obteniendo todas las variantes...');
    const variantesResponse = await axios.get(`${BASE_URL}/variantes-producto`);
    console.log('✅ Variantes obtenidas:', variantesResponse.data.variantes.length);

    // 4. Obtener variantes por producto (público)
    console.log('\n4️⃣ Obteniendo variantes por producto...');
    const variantesProductoResponse = await axios.get(`${BASE_URL}/variantes-producto/producto/1`);
    console.log('✅ Variantes del producto obtenidas');

    // 5. Crear nueva variante (admin)
    console.log('\n5️⃣ Creando nueva variante...');
    const nuevaVarianteResponse = await axios.post(`${BASE_URL}/variantes-producto`, {
      id_producto: 1,
      id_talla: 1,
      id_color: 1,
      stock: 20,
      precio_adicional: 10.00
    }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Variante creada:', nuevaVarianteResponse.data.variante.id_variante);

    const varianteId = nuevaVarianteResponse.data.variante.id_variante;

    // 6. Obtener variante por ID (público)
    console.log('\n6️⃣ Obteniendo variante por ID...');
    const varianteResponse = await axios.get(`${BASE_URL}/variantes-producto/${varianteId}`);
    console.log('✅ Variante obtenida por ID');

    // 7. Verificar stock (público)
    console.log('\n7️⃣ Verificando stock...');
    const stockResponse = await axios.get(`${BASE_URL}/variantes-producto/${varianteId}/verificar-stock?cantidad=5`);
    console.log('✅ Stock verificado:', stockResponse.data.disponible);

    // 8. Actualizar variante (admin)
    console.log('\n8️⃣ Actualizando variante...');
    const actualizarResponse = await axios.put(`${BASE_URL}/variantes-producto/${varianteId}`, {
      stock: 25,
      precio_adicional: 15.00
    }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Variante actualizada');

    // 9. Actualizar stock (admin)
    console.log('\n9️⃣ Actualizando stock...');
    const stockUpdateResponse = await axios.put(`${BASE_URL}/variantes-producto/${varianteId}/stock`, {
      cantidad: 10
    }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Stock actualizado');

    // 10. Obtener variantes con stock bajo (público)
    console.log('\n🔟 Obteniendo variantes con stock bajo...');
    const stockBajoResponse = await axios.get(`${BASE_URL}/variantes-producto/stock-bajo?limite=30`);
    console.log('✅ Variantes con stock bajo obtenidas');

    // 11. Probar acceso sin token (debe fallar)
    console.log('\n1️⃣1️⃣ Probando acceso sin token...');
    try {
      await axios.post(`${BASE_URL}/variantes-producto`, {
        id_producto: 1,
        id_talla: 1,
        id_color: 2
      });
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (401)');
    }

    // 12. Probar acceso con token de cliente (debe fallar)
    console.log('\n1️⃣2️⃣ Probando acceso con token de cliente...');
    try {
      await axios.post(`${BASE_URL}/variantes-producto`, {
        id_producto: 1,
        id_talla: 1,
        id_color: 2
      }, {
        headers: { Authorization: `Bearer ${tokenCliente}` }
      });
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (403)');
    }

    // 13. Eliminar variante (admin)
    console.log('\n1️⃣3️⃣ Eliminando variante...');
    await axios.delete(`${BASE_URL}/variantes-producto/${varianteId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Variante eliminada');

    console.log('\n✅ Todas las pruebas de endpoints HTTP del módulo VariantesProducto completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testEndpointsVariantesProducto(); 