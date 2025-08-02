const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokenAdmin = '';

async function loginAdmin() {
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'admin@gardem.com',
      contraseña: 'admin123'
    });
    tokenAdmin = response.data.token;
    console.log('✅ Login admin exitoso');
    return true;
  } catch (error) {
    console.error('❌ Error en login admin:', error.response?.data || error.message);
    return false;
  }
}

async function diagnosticarItemsCesta() {
  console.log('�� DIAGNÓSTICO DEL MÓDULO ITEMS CESTA');
  console.log('=====================================');

  try {
    // Login
    const adminLogin = await loginAdmin();
    if (!adminLogin) {
      console.log('❌ No se pudo hacer login como admin');
      return;
    }

    console.log('\n1. Probando endpoint GET /api/items-cesta...');
    try {
      const response = await axios.get(`${BASE_URL}/items-cesta`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` }
      });
      console.log('✅ GET /api/items-cesta exitoso:', response.status);
      console.log('   Datos:', response.data);
    } catch (error) {
      console.log('❌ GET /api/items-cesta falló:', error.response?.status);
      console.log('   Error:', error.response?.data || error.message);
    }

    console.log('\n2. Verificando si hay cestas existentes...');
    try {
      const cestasResponse = await axios.get(`${BASE_URL}/cesta-pedido`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` }
      });
      console.log('✅ Cestas obtenidas:', cestasResponse.status);
      console.log('   Total cestas:', cestasResponse.data.total);
      
      if (cestasResponse.data.cestas && cestasResponse.data.cestas.length > 0) {
        const primeraCesta = cestasResponse.data.cestas[0];
        console.log('   Primera cesta ID:', primeraCesta.id_cesta);
        
        console.log('\n3. Probando obtener items de la primera cesta...');
        try {
          const itemsResponse = await axios.get(`${BASE_URL}/items-cesta/cesta/${primeraCesta.id_cesta}`, {
            headers: { Authorization: `Bearer ${tokenAdmin}` }
          });
          console.log('✅ Items de cesta obtenidos:', itemsResponse.status);
          console.log('   Total items:', itemsResponse.data.total);
        } catch (error) {
          console.log('❌ Error obteniendo items de cesta:', error.response?.status);
          console.log('   Error:', error.response?.data || error.message);
        }
      } else {
        console.log('   No hay cestas disponibles para probar');
      }
    } catch (error) {
      console.log('❌ Error obteniendo cestas:', error.response?.status);
      console.log('   Error:', error.response?.data || error.message);
    }

    console.log('\n4. Probando endpoint sin autenticación...');
    try {
      await axios.get(`${BASE_URL}/items-cesta`);
      console.log('❌ Debería haber fallado sin token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Acceso denegado correctamente (401)');
      } else {
        console.log('❌ Error inesperado:', error.response?.status);
      }
    }

    console.log('\n5. Verificando estructura de respuesta...');
    try {
      const response = await axios.get(`${BASE_URL}/items-cesta`, {
        headers: { Authorization: `Bearer ${tokenAdmin}` }
      });
      
      if (response.data && typeof response.data === 'object') {
        console.log('✅ Estructura de respuesta válida');
        console.log('   Propiedades:', Object.keys(response.data));
        
        if (response.data.total !== undefined) {
          console.log('✅ Propiedad "total" presente');
        } else {
          console.log('❌ Propiedad "total" faltante');
        }
        
        if (response.data.items !== undefined) {
          console.log('✅ Propiedad "items" presente');
        } else {
          console.log('❌ Propiedad "items" faltante');
        }
      } else {
        console.log('❌ Estructura de respuesta inválida');
      }
    } catch (error) {
      console.log('❌ No se pudo verificar estructura:', error.message);
    }

  } catch (error) {
    console.error('❌ Error general en el diagnóstico:', error.message);
  }
}

// Ejecutar diagnóstico
diagnosticarItemsCesta(); 