const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokenAdmin = '';
let tokenCliente = '';

async function testEndpointsImagenesProducto() {
  console.log('🧪 Iniciando pruebas de endpoints HTTP del módulo ImagenesProducto...\n');

  try {
    // 1. Login como administrador
    console.log('1️⃣ Iniciando sesión como administrador...');
    const loginAdminResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'admin@gardem.com',
      contraseña: 'admin123'  // Cambiado de 'password' a 'contraseña'
    });
    tokenAdmin = loginAdminResponse.data.token;
    console.log('✅ Login admin exitoso');

    // 2. Login como cliente
    console.log('\n2️⃣ Iniciando sesión como cliente...');
    const loginClienteResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'cliente@gardem.com',
      contraseña: 'cliente123'  // Cambiado de 'password' a 'contraseña'
    });
    tokenCliente = loginClienteResponse.data.token;
    console.log('✅ Login cliente exitoso');

    // 3. Obtener todas las imágenes (público)
    console.log('\n3️⃣ Obteniendo todas las imágenes...');
    const imagenesResponse = await axios.get(`${BASE_URL}/imagenes-producto`);
    console.log('✅ Imágenes obtenidas:', imagenesResponse.data.imagenes.length);

    // 4. Obtener imágenes por producto (público)
    console.log('\n4️⃣ Obteniendo imágenes por producto...');
    const imagenesProductoResponse = await axios.get(`${BASE_URL}/imagenes-producto/producto/1`);
    console.log('✅ Imágenes del producto obtenidas');

    // 5. Crear nueva imagen (admin)
    console.log('\n5️⃣ Creando nueva imagen...');
    const nuevaImagenResponse = await axios.post(`${BASE_URL}/imagenes-producto`, {
      id_producto: 1,
      url_imagen: 'https://example.com/imagen-test.jpg',
      alt_text: 'Imagen de prueba',
      orden: 1,
      es_principal: true
    }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Imagen creada:', nuevaImagenResponse.data.imagen.id_imagen);

    const imagenId = nuevaImagenResponse.data.imagen.id_imagen;

    // 6. Obtener imagen por ID (público)
    console.log('\n6️⃣ Obteniendo imagen por ID...');
    const imagenResponse = await axios.get(`${BASE_URL}/imagenes-producto/${imagenId}`);
    console.log('✅ Imagen obtenida por ID');

    // 7. Obtener imagen principal (público)
    console.log('\n7️⃣ Obteniendo imagen principal...');
    const imagenPrincipalResponse = await axios.get(`${BASE_URL}/imagenes-producto/producto/1/principal`);
    console.log('✅ Imagen principal obtenida');

    // 8. Actualizar imagen (admin)
    console.log('\n8️⃣ Actualizando imagen...');
    const actualizarResponse = await axios.put(`${BASE_URL}/imagenes-producto/${imagenId}`, {
      alt_text: 'Imagen actualizada',
      orden: 2
    }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Imagen actualizada');

    // 9. Marcar como principal (admin)
    console.log('\n9️⃣ Marcando como principal...');
    const principalResponse = await axios.put(`${BASE_URL}/imagenes-producto/${imagenId}/principal`, {}, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Imagen marcada como principal');

    // 10. Subir múltiples imágenes (admin)
    console.log('\n1️⃣0️⃣ Subiendo múltiples imágenes...');
    const multiplesResponse = await axios.post(`${BASE_URL}/imagenes-producto/producto/1/multiples`, {
      imagenes: [
        {
          url_imagen: 'https://example.com/imagen2.jpg',
          alt_text: 'Segunda imagen',
          orden: 3,
          es_principal: false
        },
        {
          url_imagen: 'https://example.com/imagen3.jpg',
          alt_text: 'Tercera imagen',
          orden: 4,
          es_principal: false
        }
      ]
    }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Múltiples imágenes subidas');

    // 11. Reordenar imágenes (admin)
    console.log('\n1️⃣1️⃣ Reordenando imágenes...');
    const reordenarResponse = await axios.put(`${BASE_URL}/imagenes-producto/producto/1/reordenar`, {
      ordenImagenes: [
        { id_imagen: imagenId, orden: 1 },
        { id_imagen: multiplesResponse.data.imagenes[0].id_imagen, orden: 2 },
        { id_imagen: multiplesResponse.data.imagenes[1].id_imagen, orden: 3 }
      ]
    }, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Imágenes reordenadas');

    // 12. Obtener estadísticas (público)
    console.log('\n1️⃣2️⃣ Obteniendo estadísticas...');
    const estadisticasResponse = await axios.get(`${BASE_URL}/imagenes-producto/estadisticas`);
    console.log('✅ Estadísticas obtenidas:', estadisticasResponse.data.estadisticas);

    // 13. Probar acceso sin token (debe fallar)
    console.log('\n1️⃣3️⃣ Probando acceso sin token...');
    try {
      await axios.post(`${BASE_URL}/imagenes-producto`, {
        id_producto: 1,
        url_imagen: 'https://example.com/test.jpg'
      });
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (401)');
    }

    // 14. Probar acceso con token de cliente (debe fallar)
    console.log('\n1️⃣4️⃣ Probando acceso con token de cliente...');
    try {
      await axios.post(`${BASE_URL}/imagenes-producto`, {
        id_producto: 1,
        url_imagen: 'https://example.com/test.jpg'
      }, {
        headers: { Authorization: `Bearer ${tokenCliente}` }
      });
    } catch (error) {
      console.log('✅ Acceso denegado correctamente (403)');
    }

    // 15. Limpiar imágenes de prueba
    console.log('\n1️⃣5️⃣ Limpiando imágenes de prueba...');
    for (const imagen of multiplesResponse.data.imagenes) {
      await axios.delete(`${BASE_URL}/imagenes-producto/${imagen.id_imagen}`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` }
      });
    }
    await axios.delete(`${BASE_URL}/imagenes-producto/${imagenId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Imágenes de prueba eliminadas');

    console.log('\n✅ Todas las pruebas de endpoints HTTP del módulo ImagenesProducto completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testEndpointsImagenesProducto(); 