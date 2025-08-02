const { executeQuery } = require('./src/database/connection');

async function verificarTablasPedidos() {
  console.log('�� Verificando tablas del módulo Pedidos...\n');

  try {
    // Verificar si las tablas existen
    console.log('1️⃣ Verificando existencia de tablas...');
    const tablas = await executeQuery("SHOW TABLES LIKE '%Pedido%'");
    console.log('✅ Tablas encontradas:', tablas.length);
    
    if (tablas.length > 0) {
      tablas.forEach(tabla => {
        console.log('   -', Object.values(tabla)[0]);
      });
    }

    // Verificar estructura de la tabla Pedidos
    if (tablas.length > 0) {
      console.log('\n2️⃣ Verificando estructura de tabla Pedidos...');
      const estructura = await executeQuery('DESCRIBE Pedidos');
      console.log('✅ Columnas en Pedidos:', estructura.length);
      estructura.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type}`);
      });
    }

    // Verificar si hay datos en las tablas
    console.log('\n3️⃣ Verificando datos en tablas...');
    const totalPedidos = await executeQuery('SELECT COUNT(*) as total FROM Pedidos');
    console.log('✅ Total de pedidos:', totalPedidos[0].total);

    const totalItems = await executeQuery('SELECT COUNT(*) as total FROM ItemsPedido');
    console.log('✅ Total de items de pedido:', totalItems[0].total);

    const totalEstados = await executeQuery('SELECT COUNT(*) as total FROM EstadosPedido');
    console.log('✅ Total de estados de pedido:', totalEstados[0].total);

    console.log('\n✅ Verificación completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la verificación:', error.message);
    
    if (error.message.includes('doesn\'t exist')) {
      console.log('\n💡 Las tablas no existen. Ejecuta el script SQL para crearlas.');
    }
  }
}

// Ejecutar verificación
verificarTablasPedidos(); 