// Script simple para probar rutas de categorías
const http = require('http');

function testRoute(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ status: 'ERROR', data: { error: error.message } });
    });
    
    req.end();
  });
}

async function testCategorias() {
  console.log('🧪 Probando rutas de categorías...\n');

  // Probar ruta principal
  console.log('1️⃣ Probando ruta principal...');
  const mainResult = await testRoute('/');
  console.log('Status:', mainResult.status);
  console.log('Response:', JSON.stringify(mainResult.data, null, 2));
  console.log('─'.repeat(50));

  // Probar health check
  console.log('2️⃣ Probando health check...');
  const healthResult = await testRoute('/health');
  console.log('Status:', healthResult.status);
  console.log('Response:', JSON.stringify(healthResult.data, null, 2));
  console.log('─'.repeat(50));

  // Probar ruta de categorías
  console.log('3️⃣ Probando ruta de categorías...');
  const categoriesResult = await testRoute('/api/categorias');
  console.log('Status:', categoriesResult.status);
  console.log('Response:', JSON.stringify(categoriesResult.data, null, 2));
  console.log('─'.repeat(50));

  // Probar ruta de usuarios (para comparar)
  console.log('4️⃣ Probando ruta de usuarios...');
  const usersResult = await testRoute('/api/usuarios');
  console.log('Status:', usersResult.status);
  console.log('Response:', JSON.stringify(usersResult.data, null, 2));
  console.log('─'.repeat(50));
}

testCategorias().catch(console.error); 