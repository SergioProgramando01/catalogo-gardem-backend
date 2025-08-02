const authService = require('./src/modules/usuarios/services/authService');
const Usuario = require('./src/modules/usuarios/models/Usuario');

async function testMiddlewareAuth() {
  console.log('🧪 Prueba del middleware de autenticación...\n');

  try {
    // 1. Obtener un usuario de prueba
    const usuario = await Usuario.buscarPorEmail('admin@gardem.com');
    console.log('1️⃣ Usuario encontrado:', usuario.email);

    // 2. Generar token
    const token = authService.generarToken(usuario);
    console.log('2️⃣ Token generado:', token.substring(0, 20) + '...');

    // 3. Verificar token
    const payload = authService.verificarToken(token);
    console.log('3️⃣ Token verificado:', payload);

    // 4. Simular middleware de autenticación
    console.log('4️⃣ Probando middleware de autenticación...');
    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const res = {
      status: (code) => {
        console.log('📊 Status code:', code);
        return {
          json: (data) => {
            console.log('❌ Error del middleware:', data);
          }
        };
      }
    };

    let usuarioAgregado = null;
    const next = () => {
      console.log('✅ Middleware ejecutado correctamente');
      console.log('Usuario agregado:', req.usuario);
      usuarioAgregado = req.usuario;
    };

    // Ejecutar middleware
    await authService.middlewareAuth()(req, res, next);

    if (usuarioAgregado) {
      console.log('5️⃣ Probando middleware de admin...');
      const adminMiddleware = authService.middlewareAdmin();
      adminMiddleware(req, res, () => {
        console.log('✅ Middleware de admin ejecutado correctamente');
      });
    }

    console.log('\n✅ Prueba del middleware completada!');

  } catch (error) {
    console.error('❌ Error en la prueba del middleware:', error.message);
  }
}

// Ejecutar prueba
testMiddlewareAuth(); 