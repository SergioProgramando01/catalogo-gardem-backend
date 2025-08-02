// Script de prueba para el módulo de usuarios
// Ejecutar: node test-usuarios.js

const Usuario = require('./src/modules/usuarios/models/Usuario');
const authService = require('./src/modules/usuarios/services/authService');

async function probarModuloUsuarios() {
  console.log('🧪 Probando módulo de usuarios...\n');

  try {
    // 1. Crear un usuario de prueba
    console.log('1️⃣ Creando usuario de prueba...');
    const timestamp = Date.now();
    const datosUsuario = {
      nombre_usuario: `usuario_prueba_${timestamp}`,
      email: `prueba_${timestamp}@gardem.com`,
      contraseña: '123456',
      rol: 'Cliente'
    };

    const resultadoRegistro = await authService.registrar(datosUsuario);
    console.log('✅ Usuario creado:', resultadoRegistro.usuario);
    console.log('🔑 Token generado:', resultadoRegistro.token.substring(0, 50) + '...\n');

    // 2. Probar login
    console.log('2️⃣ Probando login...');
    const resultadoLogin = await authService.login(datosUsuario.email, '123456');
    console.log('✅ Login exitoso:', resultadoLogin.usuario);
    console.log('🔑 Token de login:', resultadoLogin.token.substring(0, 50) + '...\n');

    // 3. Verificar token
    console.log('3️⃣ Verificando token...');
    const usuarioActual = await authService.obtenerUsuarioActual(resultadoLogin.token);
    console.log('✅ Token válido, usuario:', usuarioActual);

    // 4. Probar cambio de contraseña
    console.log('\n4️⃣ Probando cambio de contraseña...');
    await authService.cambiarContraseña(
      usuarioActual.id_usuario,
      '123456',
      'nueva123456'
    );
    console.log('✅ Contraseña cambiada exitosamente');

    // 5. Probar login con nueva contraseña
    console.log('\n5️⃣ Probando login con nueva contraseña...');
    const nuevoLogin = await authService.login(datosUsuario.email, 'nueva123456');
    console.log('✅ Login con nueva contraseña exitoso');

    // 6. Obtener todos los usuarios
    console.log('\n6️⃣ Obteniendo todos los usuarios...');
    const todosUsuarios = await Usuario.obtenerTodos();
    console.log(`✅ Total de usuarios: ${todosUsuarios.length}`);
    todosUsuarios.forEach((usuario, index) => {
      console.log(`   ${index + 1}. ${usuario.nombre_usuario} (${usuario.email}) - ${usuario.rol}`);
    });

    // 7. Limpiar - eliminar usuario de prueba
    console.log('\n7️⃣ Limpiando datos de prueba...');
    await Usuario.eliminar(usuarioActual.id_usuario);
    console.log('✅ Usuario de prueba eliminado');

    console.log('\n🎉 ¡Todas las pruebas del módulo usuarios fueron exitosas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
probarModuloUsuarios(); 