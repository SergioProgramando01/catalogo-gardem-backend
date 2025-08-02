const axios = require('axios');

async function debugPedidos() {
  console.log('🔍 Debug del módulo Pedidos...\n');

  try {
    const BASE_URL = 'http://localhost:3000/api';

    // 1. Login como administrador
    console.log('1️⃣ Obteniendo token de administrador...');
    const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'admin@gardem.com',
      contraseña: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido');

    // 2. Probar endpoint de pedidos con más detalles
    console.log('\n2️⃣ Probando endpoint GET /api/pedidos...');
    
    try {
      const pedidosResponse = await axios.get(`${BASE_URL}/pedidos`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 segundos de timeout
      });
      
      console.log('✅ Respuesta exitosa:', pedidosResponse.data);
      
    } catch (pedidoError) {
      console.error('❌ Error específico del endpoint pedidos:');
      console.error('Status:', pedidoError.response?.status);
      console.error('Data:', pedidoError.response?.data);
      
      // Intentar obtener más información del error
      if (pedidoError.response?.data?.mensaje) {
        console.error('Mensaje de error:', pedidoError.response.data.mensaje);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar debug
debugPedidos(); 