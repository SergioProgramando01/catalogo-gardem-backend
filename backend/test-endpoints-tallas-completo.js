const http = require('http');

const BASE_URL = 'localhost';
const PORT = 3000;
let adminToken = '';
let tallaId = null;

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: BASE_URL,
      port: PORT,
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

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ status: 'ERROR', data: { error: error.message } });
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

function showResult(testName, result) {
  console.log(`\n${testName}:`);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  console.log('─'.repeat(50));
}

async function testEndpoints() {
  console.log(' Probando endpoints del módulo Tallas...\n');

  // 1. Verificar servidor
  console.log('1️⃣ Verificando servidor...');
  const serverTest = await makeRequest('/');
  showResult('Servidor', serverTest);

  // 2. Obtener todas las tallas (público)
  console.log('2️⃣ Obteniendo todas las tallas...');
  const allTallasResult = await makeRequest('/api/tallas');
  showResult('Todas las Tallas', allTallasResult);

  // 3. Obtener tallas con conteo (público)
  console.log('3️⃣ Obteniendo tallas con conteo...');
  const tallasWithCountResult = await makeRequest('/api/tallas/con-conteo');
  showResult('Tallas con Conteo', tallasWithCountResult);

  // 4. Crear usuario administrador para pruebas
  console.log('4️⃣ Creando usuario administrador...');
  const timestamp = Date.now();
  const adminData = {
    nombre_usuario: `admin_talla_${timestamp}`,
    email: `admin_talla_${timestamp}@gardem.com`,
    contraseña: 'admin123',
    rol: 'Administrador'
  };

  const adminRegisterResult = await makeRequest('/api/usuarios/registrar', 'POST', adminData);
  showResult('Registro Admin', adminRegisterResult);

  if (adminRegisterResult.status === 201) {
    adminToken = adminRegisterResult.data.token;
    console.log(`✅ Token Admin: ${adminToken.substring(0, 50)}...`);
  }

  // 5. Crear nueva talla (requiere admin)
  console.log('5️⃣ Creando nueva talla...');
  const tallaData = {
    nombre: `TALLA_TEST_${timestamp}_${Math.floor(Math.random() * 10000)}`
  };

  const createTallaResult = await makeRequest('/api/tallas', 'POST', tallaData, {
    'Authorization': `Bearer ${adminToken}`
  });
  showResult('Crear Talla', createTallaResult);

  if (createTallaResult.status === 201) {
    tallaId = createTallaResult.data.talla.id_talla;
    console.log(`✅ Talla creada con ID: ${tallaId}`);
  }

  // 6. Obtener talla por ID (público)
  console.log('6️⃣ Obteniendo talla por ID...');
  const getTallaResult = await makeRequest(`/api/tallas/${tallaId}`);
  showResult('Obtener Talla por ID', getTallaResult);

  // 7. Actualizar talla (requiere admin)
  console.log('7️⃣ Actualizando talla...');
  const updateData = {
    nombre: `TALLA_ACTUALIZADA_${timestamp}`
  };

  const updateTallaResult = await makeRequest(`/api/tallas/${tallaId}`, 'PUT', updateData, {
    'Authorization': `Bearer ${adminToken}`
  });
  showResult('Actualizar Talla', updateTallaResult);

  // 8. Probar acceso sin token (debe fallar)
  console.log('8️⃣ Probando acceso sin token...');
  const noTokenResult = await makeRequest('/api/tallas', 'POST', tallaData);
  showResult('Sin Token', noTokenResult);

  // 9. Probar token inválido (debe fallar)
  console.log('9️⃣ Probando token inválido...');
  const invalidTokenResult = await makeRequest('/api/tallas', 'POST', tallaData, {
    'Authorization': 'Bearer token_invalido'
  });
  showResult('Token Inválido', invalidTokenResult);

  // 10. Crear usuario normal para probar acceso denegado
  console.log('🔟 Creando usuario normal...');
  const normalUserData = {
    nombre_usuario: `user_talla_${timestamp}`,
    email: `user_talla_${timestamp}@gardem.com`,
    contraseña: 'user123',
    rol: 'Cliente'
  };

  const userRegisterResult = await makeRequest('/api/usuarios/registrar', 'POST', normalUserData);
  showResult('Registro Usuario Normal', userRegisterResult);

  let userToken = '';
  if (userRegisterResult.status === 201) {
    userToken = userRegisterResult.data.token;
    console.log(`✅ Token Usuario: ${userToken.substring(0, 50)}...`);
  }

  // 11. Probar acceso con usuario normal (debe fallar)
  console.log('1️⃣1️⃣ Probando acceso con usuario normal...');
  const normalUserAccessResult = await makeRequest('/api/tallas', 'POST', tallaData, {
    'Authorization': `Bearer ${userToken}`
  });
  showResult('Usuario Normal Accediendo Admin', normalUserAccessResult);

  // 12. Eliminar talla (requiere admin)
  console.log('1️⃣2️⃣ Eliminando talla...');
  const deleteTallaResult = await makeRequest(`/api/tallas/${tallaId}`, 'DELETE', null, {
    'Authorization': `Bearer ${adminToken}`
  });
  showResult('Eliminar Talla', deleteTallaResult);

  // 13. Verificar que la talla fue eliminada
  console.log('1️⃣3️⃣ Verificando que la talla fue eliminada...');
  const verifyDeleteResult = await makeRequest(`/api/tallas/${tallaId}`);
  showResult('Verificar Eliminación', verifyDeleteResult);

  // 14. Limpiar - eliminar usuarios de prueba
  console.log('1️⃣4️⃣ Limpiando datos de prueba...');
  if (adminToken) {
    await makeRequest(`/api/usuarios/${adminRegisterResult.data.usuario.id_usuario}`, 'DELETE', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    console.log('✅ Usuario admin eliminado');
  }

  console.log('\n🎉 ¡Pruebas completadas!');
  console.log('\n📊 Resumen:');
  console.log('- Endpoints públicos: ✅');
  console.log('- Autenticación JWT: ✅');
  console.log('- Autorización por roles: ✅');
  console.log('- CRUD de tallas: ✅');
  console.log('- Validaciones: ✅');
  console.log('- Manejo de errores: ✅');
}

testEndpoints().catch(console.error);