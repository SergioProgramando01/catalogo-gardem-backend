const axios = require('axios');

async function testEndpointDirecto() {
  console.log('�� Prueba directa del endpoint de pedidos...\n');

  try {
    const BASE_URL = 'http://localhost:3000/api';

    // 1. Login como administrador
    console.log('1️⃣ Obteniendo token de administrador...');
    const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'admin@gardem.com',
      contraseña: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido:', token.substring(0, 20) + '...');

    // 2. Probar endpoint de pedidos
    console.log('\n2️⃣ Probando endpoint GET /api/pedidos...');
    const pedidosResponse = await axios.get(`${BASE_URL}/pedidos`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta exitosa:', pedidosResponse.data);

  } catch (error) {
    console.error('❌ Error en la petición:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    
    if (error.response?.data?.error) {
      console.error('\n🔍 Error específico:', error.response.data.error);
      console.error('Mensaje:', error.response.data.mensaje);
    }
  }
}

// Ejecutar prueba
testEndpointDirecto(); 