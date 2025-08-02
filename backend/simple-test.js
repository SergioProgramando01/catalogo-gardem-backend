const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'gardem_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function testDatabaseConnection() {
  console.log('🔍 Probando conexión a la base de datos MySQL...');
  console.log('📊 Configuración:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database
  });
  
  try {
    // Intentar conectar sin especificar la base de datos primero
    const connectionWithoutDB = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    // Verificar si la base de datos existe
    const [databases] = await connectionWithoutDB.execute('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === dbConfig.database);
    
    if (dbExists) {
      console.log(`✅ Base de datos '${dbConfig.database}' existe`);
      
      // Conectar a la base de datos específica
      const connection = await mysql.createConnection(dbConfig);
      console.log(`✅ Conexión a '${dbConfig.database}' establecida`);
      
      // Verificar tablas
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`📋 Tablas encontradas: ${tables.length}`);
      
      if (tables.length > 0) {
        console.log('📋 Lista de tablas:');
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`   - ${tableName}`);
        });
      }
      
      await connection.end();
      console.log('✅ Prueba de conexión completada exitosamente');
      
    } else {
      console.log(`❌ Base de datos '${dbConfig.database}' no existe`);
      console.log('💡 Ejecuta el script SQL para crear la base de datos');
      console.log('📁 Archivo: database/gardem_db_schema.sql');
    }
    
    await connectionWithoutDB.end();
    
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:');
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Soluciones posibles:');
      console.log('   1. Verifica que XAMPP esté ejecutándose');
      console.log('   2. Confirma que MySQL esté activo');
      console.log('   3. Verifica que el puerto 3306 esté disponible');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Soluciones posibles:');
      console.log('   1. Verifica el usuario y contraseña');
      console.log('   2. Confirma que el usuario tenga permisos');
    }
  }
}

// Ejecutar la prueba
testDatabaseConnection(); 