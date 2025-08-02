const { executeQuery } = require('./src/database/connection');

async function verificarUsuarios() {
  console.log('🔍 Verificando usuarios en la base de datos...\n');

  try {
    const usuarios = await executeQuery('SELECT id_usuario, nombre_usuario, email, rol FROM Usuarios');
    
    console.log('📋 Usuarios encontrados:');
    if (usuarios.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
    } else {
      usuarios.forEach(usuario => {
        console.log(`- ID: ${usuario.id_usuario}, Nombre: ${usuario.nombre_usuario}, Email: ${usuario.email}, Rol: ${usuario.rol}`);
      });
    }

    // Verificar usuario específico
    const adminUser = await executeQuery('SELECT * FROM Usuarios WHERE email = ?', ['admin@gardem.com']);
    if (adminUser.length > 0) {
      console.log('\n✅ Usuario admin encontrado');
    } else {
      console.log('\n❌ Usuario admin NO encontrado');
    }

    const clienteUser = await executeQuery('SELECT * FROM Usuarios WHERE email = ?', ['cliente@gardem.com']);
    if (clienteUser.length > 0) {
      console.log('✅ Usuario cliente encontrado');
    } else {
      console.log('❌ Usuario cliente NO encontrado');
    }

  } catch (error) {
    console.error('❌ Error al verificar usuarios:', error.message);
  }
}

verificarUsuarios();