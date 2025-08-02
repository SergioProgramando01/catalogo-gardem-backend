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

  console.log('\n🎉 ¡Pruebas completadas!');
}

testEndpoints().catch(console.error);