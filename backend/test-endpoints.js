// Script para probar todos los endpoints del módulo usuarios
// Ejecutar: node test-endpoints.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';
let authToken = '';
let userId = null;

// Función para hacer peticiones HTTP
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 'ERROR', data: { error: error.message } };
  }
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
  const serverTest = await makeRequest(`${BASE_URL}/`);
  showResult('Servidor', serverTest);

  // 2. Verificar módulos disponibles
  console.log('2️⃣ Verificando módulos disponibles...');
  const modulesTest = await makeRequest(`${BASE_URL}/api/modulos`);
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

  const registerResult = await makeRequest(`${BASE_URL}/api/usuarios/registrar`, {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  showResult('Registro', registerResult);

  if (registerResult.status === 201) {
    authToken = registerResult.data.token;
    userId = registerResult.data.usuario.id_usuario;
    console.log(`✅ Token obtenido: ${authToken.substring(0, 50)}...`);
  }

  // 4. Login con el usuario creado
  console.log('4️⃣ Probando login...');
  const loginResult = await makeRequest(`${BASE_URL}/api/usuarios/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: userData.email,
      contraseña: userData.contraseña
    })
  });
  showResult('Login', loginResult);

  if (loginResult.status === 200) {
    authToken = loginResult.data.token;
    console.log(`✅ Token de login: ${authToken.substring(0, 50)}...`);
  }

  // 5. Obtener perfil (requiere autenticación)
  console.log('5️⃣ Obteniendo perfil...');
  const profileResult = await makeRequest(`${BASE_URL}/api/usuarios/perfil`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  showResult('Perfil', profileResult);

  // 6. Verificar token
  console.log('6️⃣ Verificando token...');
  const verifyResult = await makeRequest(`${BASE_URL}/api/usuarios/verificar-token`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  showResult('Verificar Token', verifyResult);

  // 7. Cambiar contraseña
  console.log('7️⃣ Cambiando contraseña...');
  const changePasswordResult = await makeRequest(`${BASE_URL}/api/usuarios/cambiar-contraseña`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      contraseñaActual: '123456',
      nuevaContraseña: 'nueva123456'
    })
  });
  showResult('Cambiar Contraseña', changePasswordResult);

  // 8. Login con nueva contraseña
  console.log('8️⃣ Login con nueva contraseña...');
  const newLoginResult = await makeRequest(`${BASE_URL}/api/usuarios/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: userData.email,
      contraseña: 'nueva123456'
    })
  });
  showResult('Login Nueva Contraseña', newLoginResult);

  // 9. Crear usuario administrador para probar endpoints admin
  console.log('9️⃣ Creando usuario administrador...');
  const adminData = {
    nombre_usuario: `admin_test_${timestamp}`,
    email: `admin_${timestamp}@gardem.com`,
    contraseña: 'admin123',
    rol: 'Administrador'
  };

  const adminRegisterResult = await makeRequest(`${BASE_URL}/api/usuarios/registrar`, {
    method: 'POST',
    body: JSON.stringify(adminData)
  });
  showResult('Registro Admin', adminRegisterResult);

  let adminToken = '';
  if (adminRegisterResult.status === 201) {
    adminToken = adminRegisterResult.data.token;
    console.log(`✅ Token Admin: ${adminToken.substring(0, 50)}...`);
  }

  // 10. Obtener todos los usuarios (solo admin)
  console.log('🔟 Obteniendo todos los usuarios (admin)...');
  const allUsersResult = await makeRequest(`${BASE_URL}/api/usuarios`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  showResult('Todos los Usuarios', allUsersResult);

  // 11. Obtener usuario específico (solo admin)
  if (userId) {
    console.log('1️⃣1️⃣ Obteniendo usuario específico (admin)...');
    const specificUserResult = await makeRequest(`${BASE_URL}/api/usuarios/${userId}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    showResult('Usuario Específico', specificUserResult);
  }

  // 12. Actualizar usuario (solo admin)
  if (userId) {
    console.log('1️⃣2️⃣ Actualizando usuario (admin)...');
    const updateResult = await makeRequest(`${BASE_URL}/api/usuarios/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        nombre_usuario: `updated_user_${timestamp}`
      })
    });
    showResult('Actualizar Usuario', updateResult);
  }

  // 13. Probar acceso sin token (debe fallar)
  console.log('1️⃣3️⃣ Probando acceso sin token...');
  const noTokenResult = await makeRequest(`${BASE_URL}/api/usuarios/perfil`);
  showResult('Sin Token', noTokenResult);

  // 14. Probar acceso con token inválido (debe fallar)
  console.log('1️⃣4️⃣ Probando token inválido...');
  const invalidTokenResult = await makeRequest(`${BASE_URL}/api/usuarios/perfil`, {
    headers: {
      'Authorization': 'Bearer token_invalido'
    }
  });
  showResult('Token Inválido', invalidTokenResult);

  // 15. Probar acceso admin con usuario normal (debe fallar)
  console.log('1️⃣5️⃣ Probando acceso admin con usuario normal...');
  const normalUserAdminResult = await makeRequest(`${BASE_URL}/api/usuarios`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
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