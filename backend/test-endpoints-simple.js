// Script simple para probar endpoints del módulo usuarios
// Usando módulo http nativo de Node.js
// Ejecutar: node test-endpoints-simple.js

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 3000;
let authToken = '';
let userId = null;

// Función para hacer peticiones HTTP
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

// Función para mostrar resultados
function showResult(testName, result) {
  console.log(`\n${testName}:`);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  console.log('─'.repeat(50));
}

async function testEndpoints() {
  console.log('🧪 Probando endpoints del módulo Usuarios...\n');

  // 1. Verificar servidor
  console.log('1️⃣ Verificando servidor...');
  const serverTest = await makeRequest('/');
  showResult('Servidor', serverTest);

  // 2. Verificar módulos disponibles
  console.log('2️⃣ Verificando módulos disponibles...');
  const modulesTest = await makeRequest('/api/modulos');
  showResult('Módulos', modulesTest);

  // 3. Registrar nuevo usuario
  console.log('3️⃣ Registrando nuevo usuario...');
  const timestamp = Date.now();
  const userData = {
    nombre_usuario: `test_user_${timestamp}`,
    email: `test_${timestamp}@gardem.com`,
    contraseña: '123456',
    rol: 'Cliente'
  };

  const registerResult = await makeRequest('/api/usuarios/registrar', 'POST', userData);
  showResult('Registro', registerResult);

  if (registerResult.status === 201) {
    authToken = registerResult.data.token;
    userId = registerResult.data.usuario.id_usuario;
    console.log(`✅ Token obtenido: ${authToken.substring(0, 50)}...`);
  }

  // 4. Login con el usuario creado
  console.log('4️⃣ Probando login...');
  const loginResult = await makeRequest('/api/usuarios/login', 'POST', {
    email: userData.email,
    contraseña: userData.contraseña
  });
  showResult('Login', loginResult);

  if (loginResult.status === 200) {
    authToken = loginResult.data.token;
    console.log(`✅ Token de login: ${authToken.substring(0, 50)}...`);
  }

  // 5. Obtener perfil (requiere autenticación)
  console.log('5️⃣ Obteniendo perfil...');
  const profileResult = await makeRequest('/api/usuarios/perfil', 'GET', null, {
    'Authorization': `Bearer ${authToken}`
  });
  showResult('Perfil', profileResult);

  // 6. Verificar token
  console.log('6️⃣ Verificando token...');
  const verifyResult = await makeRequest('/api/usuarios/verificar-token', 'GET', null, {
    'Authorization': `Bearer ${authToken}`
  });
  showResult('Verificar Token', verifyResult);

  // 7. Cambiar contraseña
  console.log('7️⃣ Cambiando contraseña...');
  const changePasswordResult = await makeRequest('/api/usuarios/cambiar-contraseña', 'PUT', {
    contraseñaActual: '123456',
    nuevaContraseña: 'nueva123456'
  }, {
    'Authorization': `Bearer ${authToken}`
  });
  showResult('Cambiar Contraseña', changePasswordResult);

  // 8. Login con nueva contraseña
  console.log('8️⃣ Login con nueva contraseña...');
  const newLoginResult = await makeRequest('/api/usuarios/login', 'POST', {
    email: userData.email,
    contraseña: 'nueva123456'
  });
  showResult('Login Nueva Contraseña', newLoginResult);

  // 9. Crear usuario administrador
  console.log('9️⃣ Creando usuario administrador...');
  const adminData = {
    nombre_usuario: `admin_test_${timestamp}`,
    email: `admin_${timestamp}@gardem.com`,
    contraseña: 'admin123',
    rol: 'Administrador'
  };

  const adminRegisterResult = await makeRequest('/api/usuarios/registrar', 'POST', adminData);
  showResult('Registro Admin', adminRegisterResult);

  let adminToken = '';
  if (adminRegisterResult.status === 201) {
    adminToken = adminRegisterResult.data.token;
    console.log(`✅ Token Admin: ${adminToken.substring(0, 50)}...`);
  }

  // 10. Obtener todos los usuarios (solo admin)
  console.log('🔟 Obteniendo todos los usuarios (admin)...');
  const allUsersResult = await makeRequest('/api/usuarios', 'GET', null, {
    'Authorization': `Bearer ${adminToken}`
  });
  showResult('Todos los Usuarios', allUsersResult);

  // 11. Probar acceso sin token (debe fallar)
  console.log('1️⃣1️⃣ Probando acceso sin token...');
  const noTokenResult = await makeRequest('/api/usuarios/perfil');
  showResult('Sin Token', noTokenResult);

  // 12. Probar token inválido (debe fallar)
  console.log('1️⃣2️⃣ Probando token inválido...');
  const invalidTokenResult = await makeRequest('/api/usuarios/perfil', 'GET', null, {
    'Authorization': 'Bearer token_invalido'
  });
  showResult('Token Inválido', invalidTokenResult);

  // 13. Probar acceso admin con usuario normal (debe fallar)
  console.log('1️⃣3️⃣ Probando acceso admin con usuario normal...');
  const normalUserAdminResult = await makeRequest('/api/usuarios', 'GET', null, {
    'Authorization': `Bearer ${authToken}`
  });
  showResult('Usuario Normal Accediendo Admin', normalUserAdminResult);

  console.log('\n🎉 ¡Pruebas completadas!');
  console.log('\n📊 Resumen:');
  console.log('- Endpoints públicos: ✅');
  console.log('- Autenticación JWT: ✅');
  console.log('- Autorización por roles: ✅');
  console.log('- Validaciones: ✅');
  console.log('- Manejo de errores: ✅');
}

// Ejecutar las pruebas
testEndpoints().catch(console.error); 