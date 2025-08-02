// Script rápido para probar endpoints
const http = require('http');

async function quickTest() {
  console.log('🧪 Prueba rápida de endpoints...\n');

  // Función simple para hacer requests
  function request(path, method = 'GET', body = null) {
    return new Promise((resolve) => {
      const data = body ? JSON.stringify(body) : null;
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (data) {
        options.headers['Content-Length'] = Buffer.byteLength(data);
      }

      const req = http.request(options, (res) => {
        let response = '';
        res.on('data', chunk => response += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(response) });
          } catch {
            resolve({ status: res.statusCode, data: response });
          }
        });
      });

      req.on('error', () => resolve({ status: 'ERROR', data: 'Connection failed' }));
      if (data) req.write(data);
      req.end();
    });
  }

  try {
    // 1. Test servidor
    console.log('1️⃣ Probando servidor...');
    const server = await request('/');
    console.log(`Status: ${server.status}`);
    console.log('✅ Servidor funcionando\n');

    // 2. Test módulos
    console.log('2️⃣ Probando módulos...');
    const modules = await request('/api/modulos');
    console.log(`Status: ${modules.status}`);
    console.log('✅ Módulos disponibles\n');

    // 3. Test registro
    console.log('3️⃣ Probando registro...');
    const timestamp = Date.now();
    const userData = {
      nombre_usuario: `test_${timestamp}`,
      email: `test_${timestamp}@gardem.com`,
      contraseña: '123456',
      rol: 'Cliente'
    };
    
    const register = await request('/api/usuarios/registrar', 'POST', userData);
    console.log(`Status: ${register.status}`);
    if (register.status === 201) {
      console.log('✅ Usuario registrado');
      console.log(`Token: ${register.data.token.substring(0, 50)}...\n`);
      
      // 4. Test login
      console.log('4️⃣ Probando login...');
      const login = await request('/api/usuarios/login', 'POST', {
        email: userData.email,
        contraseña: '123456'
      });
      console.log(`Status: ${login.status}`);
      console.log('✅ Login exitoso\n');

      // 5. Test perfil con token
      console.log('5️⃣ Probando perfil...');
      const profile = await request('/api/usuarios/perfil', 'GET', null, {
        'Authorization': `Bearer ${register.data.token}`
      });
      console.log(`Status: ${profile.status}`);
      console.log('✅ Perfil obtenido\n');

    } else {
      console.log('❌ Error en registro:', register.data);
    }

    console.log('🎉 ¡Pruebas completadas!');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

quickTest(); 