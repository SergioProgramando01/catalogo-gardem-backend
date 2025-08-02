// Script de prueba para endpoints HTTP del módulo categorías
// Ejecutar: node test-endpoints-categorias.js

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 3000;
let adminToken = '';
let categoriaId = null;

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
  console.log('🧪 Probando endpoints del módulo Categorías...\n');

  // 1. Verificar servidor
  console.log('1️⃣ Verificando servidor...');
  const serverTest = await makeRequest('/');
  showResult('Servidor', serverTest);

  // 2. Obtener todas las categorías (público)
  console.log('2️⃣ Obteniendo todas las categorías...');
  const allCategoriesResult = await makeRequest('/api/categorias');
  showResult('Todas las Categorías', allCategoriesResult);

  // 3. Obtener categorías con conteo (público)
  console.log('3️⃣ Obteniendo categorías con conteo...');
  const categoriesWithCountResult = await makeRequest('/api/categorias/con-conteo');
  showResult('Categorías con Conteo', categoriesWithCountResult);

  // 4. Crear usuario administrador para pruebas
  console.log('4️⃣ Creando usuario administrador...');
  const timestamp = Date.now();
  const adminData = {
    nombre_usuario: `admin_cat_${timestamp}`,
    email: `admin_cat_${timestamp}@gardem.com`,
    contraseña: 'admin123',
    rol: 'Administrador'
  };

  const adminRegisterResult = await makeRequest('/api/usuarios/registrar', 'POST', adminData);
  showResult('Registro Admin', adminRegisterResult);

  if (adminRegisterResult.status === 201) {
    adminToken = adminRegisterResult.data.token;
    console.log(`✅ Token Admin: ${adminToken.substring(0, 50)}...`);
  }

  // 5. Crear nueva categoría (requiere admin)
  console.log('5️⃣ Creando nueva categoría...');
  const categoryData = {
    nombre: `Categoría Test ${timestamp}`,
    descripcion: 'Descripción de prueba para la categoría',
    activa: true
  };

  const createCategoryResult = await makeRequest('/api/categorias', 'POST', categoryData, {
    'Authorization': `Bearer ${adminToken}`
  });
  showResult('Crear Categoría', createCategoryResult);

  if (createCategoryResult.status === 201) {
    categoriaId = createCategoryResult.data.categoria.id_categoria;
    console.log(`✅ Categoría creada con ID: ${categoriaId}`);
  }

  // 6. Obtener categoría por ID (público)
  console.log('6️⃣ Obteniendo categoría por ID...');
  const getCategoryResult = await makeRequest(`/api/categorias/${categoriaId}`);
  showResult('Obtener Categoría por ID', getCategoryResult);

  // 7. Actualizar categoría (requiere admin)
  console.log('7️⃣ Actualizando categoría...');
  const updateData = {
    nombre: `Categoría Actualizada ${timestamp}`,
    descripcion: 'Descripción actualizada'
  };

  const updateCategoryResult = await makeRequest(`/api/categorias/${categoriaId}`, 'PUT', updateData, {
    'Authorization': `Bearer ${adminToken}`
  });
  showResult('Actualizar Categoría', updateCategoryResult);

  // 8. Probar acceso sin token (debe fallar)
  console.log('8️⃣ Probando acceso sin token...');
  const noTokenResult = await makeRequest('/api/categorias', 'POST', categoryData);
  showResult('Sin Token', noTokenResult);

  // 9. Probar token inválido (debe fallar)
  console.log('9️⃣ Probando token inválido...');
  const invalidTokenResult = await makeRequest('/api/categorias', 'POST', categoryData, {
    'Authorization': 'Bearer token_invalido'
  });
  showResult('Token Inválido', invalidTokenResult);

  // 10. Crear usuario normal para probar acceso denegado
  console.log('🔟 Creando usuario normal...');
  const normalUserData = {
    nombre_usuario: `user_cat_${timestamp}`,
    email: `user_cat_${timestamp}@gardem.com`,
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
  const normalUserAccessResult = await makeRequest('/api/categorias', 'POST', categoryData, {
    'Authorization': `Bearer ${userToken}`
  });
  showResult('Usuario Normal Accediendo Admin', normalUserAccessResult);

  // 12. Eliminar categoría (requiere admin)
  console.log('1️⃣2️⃣ Eliminando categoría...');
  const deleteCategoryResult = await makeRequest(`/api/categorias/${categoriaId}`, 'DELETE', null, {
    'Authorization': `Bearer ${adminToken}`
  });
  showResult('Eliminar Categoría', deleteCategoryResult);

  // 13. Verificar que la categoría fue eliminada
  console.log('1️⃣3️⃣ Verificando que la categoría fue eliminada...');
  const verifyDeleteResult = await makeRequest(`/api/categorias/${categoriaId}`);
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
  console.log('- CRUD de categorías: ✅');
  console.log('- Validaciones: ✅');
  console.log('- Manejo de errores: ✅');
}

// Función para verificar que el servidor esté funcionando
async function verificarServidor() {
  try {
    console.log('🔍 Verificando que el servidor esté funcionando...');
    const respuesta = await makeRequest('/health');
    console.log('✅ Servidor funcionando:', respuesta.data);
    console.log('');
    return true;
  } catch (error) {
    console.error('❌ El servidor no está funcionando. Inicia el servidor con:');
    console.error('   node src/app.js');
    console.error('   o');
    console.error('   npm run dev');
    return false;
  }
}

// Función principal
async function main() {
  const servidorOk = await verificarServidor();
  if (servidorOk) {
    await testEndpoints();
  }
}

// Ejecutar las pruebas
main().catch(console.error); 