const axios = require('axios');

async function testDebug() {
  console.log('🔍 Debug del módulo EstadosPedido...\n');

  try {
    // 1. Login para obtener token
    console.log('1️⃣ Obteniendo token...');
    const loginResponse = await axios.post('http://localhost:3000/api/usuarios/login', {
      email: 'cliente@gardem.com',
      contraseña: 'cliente123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido');

    // 2. Probar ruta de test
    console.log('\n2️⃣ Probando ruta de test...');
    const testResponse = await axios.get('http://localhost:3000/api/historial-estados/test', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Ruta de test funcionando:', testResponse.data);

    // 3. Probar ruta básica
    console.log('\n3️⃣ Probando ruta básica...');
    const basicResponse = await axios.get('http://localhost:3000/api/historial-estados/mis-estados', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Ruta básica funcionando:', basicResponse.data);

    // 4. Verificar métodos disponibles
    console.log('\n4️⃣ Métodos disponibles en el controlador:');
    console.log(testResponse.data.metodos);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Ejecutar prueba
testDebug(); 