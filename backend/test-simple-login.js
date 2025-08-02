const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testSimpleLogin() {
  console.log('🧪 Prueba simple de login...\n');

  try {
    // 1. Verificar que el servidor esté funcionando
    console.log('1️⃣ Verificando que el servidor esté funcionando...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Servidor funcionando:', healthResponse.data);

    // 2. Probar login con datos explícitos
    console.log('\n2️⃣ Probando login...');
    const loginData = {
      email: 'admin@gardem.com',
      password: 'admin123'
    };
    
    console.log('📤 Enviando datos:', loginData);
    
    const loginResponse = await axios.post(`${BASE_URL}/usuarios/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login exitoso:', loginResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 El servidor no está funcionando. Ejecuta: node src/app.js');
    }
  }
}

testSimpleLogin(); 