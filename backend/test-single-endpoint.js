// Script para probar un endpoint específico
// Ejecutar: node test-single-endpoint.js

const http = require('http');

function testEndpoint(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    console.log(`\n🔍 Probando: ${method} ${path}`);
    console.log('Headers:', JSON.stringify(options.headers, null, 2));
    if (data) {
      console.log('Body:', JSON.stringify(data, null, 2));
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n📊 Status: ${res.statusCode}`);
        try {
          const parsedData = JSON.parse(responseData);
          console.log('Response:', JSON.stringify(parsedData, null, 2));
        } catch (error) {
          console.log('Response:', responseData);
        }
        console.log('─'.repeat(60));
        resolve({ status: res.statusCode, data: responseData });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error: ${error.message}`);
      resolve({ status: 'ERROR', data: { error: error.message } });
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Función principal para probar endpoints
async function runTests() {
  console.log('🧪 Probando endpoints del módulo Usuarios...\n');

  // 1. Verificar servidor
  await testEndpoint('/');

  // 2. Verificar módulos
  await testEndpoint('/api/modulos');

  // 3. Registrar usuario
  const timestamp = Date.now();
  const userData = {
    nombre_usuario: `test_user_${timestamp}`,
    email: `test_${timestamp}@gardem.com`,
    contraseña: '123456',
    rol: 'Cliente'
  };

  const registerResult = await testEndpoint('/api/usuarios/registrar', 'POST', userData);
  
  // Extraer token si el registro fue exitoso
  let authToken = '';
  if (registerResult.status === 201) {
    try {
      const parsedData = JSON.parse(registerResult.data);
      authToken = parsedData.token;
      console.log(`✅ Token obtenido: ${authToken.substring(0, 50)}...`);
    } catch (error) {
      console.log('❌ Error al parsear respuesta de registro');
    }
  }

  // 4. Login
  await testEndpoint('/api/usuarios/login', 'POST', {
    email: userData.email,
    contraseña: userData.contraseña
  });

  // 5. Obtener perfil (con token)
  if (authToken) {
    await testEndpoint('/api/usuarios/perfil', 'GET', null, {
      'Authorization': `Bearer ${authToken}`
    });
  }

  // 6. Probar sin token (debe fallar)
  await testEndpoint('/api/usuarios/perfil');

  console.log('\n🎉 ¡Pruebas completadas!');
}

// Ejecutar pruebas
runTests().catch(console.error); 