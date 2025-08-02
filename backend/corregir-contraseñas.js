const bcrypt = require('bcryptjs');
const { executeQuery } = require('./src/database/connection');

async function corregirContraseñas() {
  console.log('🔧 Corrigiendo contraseñas de usuarios...\n');

  try {
    // Hash de las contraseñas correctas
    const passwordAdmin = await bcrypt.hash('admin123', 10);
    const passwordCliente = await bcrypt.hash('cliente123', 10);

    console.log('�� Actualizando contraseña del administrador...');
    await executeQuery(
      'UPDATE Usuarios SET contraseña = ? WHERE email = ?',
      [passwordAdmin, 'admin@gardem.com']
    );

    console.log('�� Actualizando contraseña del cliente...');
    await executeQuery(
      'UPDATE Usuarios SET contraseña = ? WHERE email = ?',
      [passwordCliente, 'cliente@gardem.com']
    );

    // Verificar usuarios actualizados
    const usuarios = await executeQuery('SELECT id_usuario, nombre_usuario, email, rol FROM Usuarios');
    console.log('\n✅ Usuarios actualizados:');
    usuarios.forEach(usuario => {
      console.log(`- ${usuario.nombre_usuario} (${usuario.email}) - ${usuario.rol}`);
    });

    console.log('\n�� Contraseñas actualizadas:');
    console.log('   Admin: admin@gardem.com / admin123');
    console.log('   Cliente: cliente@gardem.com / cliente123');

  } catch (error) {
    console.error('❌ Error al corregir contraseñas:', error.message);
  }
}

corregirContraseñas(); 