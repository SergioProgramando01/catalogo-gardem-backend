// Script simple para probar solo la conexión a MySQL
// Ejecutar: node test-mysql-only.js

console.log('🔍 Iniciando prueba de conexión a MySQL...');

// Intentar cargar mysql2
try {
  const mysql = require('mysql2/promise');
  console.log('✅ mysql2 cargado correctamente');
  
  // Configuración de la base de datos
  const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'gardem_db'
  };
  
  console.log('📊 Configuración:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database
  });
  
  // Función para probar conexión
  async function testConnection() {
    try {
      console.log('🔌 Intentando conectar a MySQL...');
      
      // Conectar sin especificar base de datos primero
      const connection = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password
      });
      
      console.log('✅ Conexión a MySQL establecida');
      
      // Verificar si la base de datos existe
      const [databases] = await connection.execute('SHOW DATABASES');
      const dbExists = databases.some(db => db.Database === dbConfig.database);
      
      if (dbExists) {
        console.log(`✅ Base de datos '${dbConfig.database}' existe`);
        
        // Conectar a la base de datos específica
        const dbConnection = await mysql.createConnection(dbConfig);
        console.log(`✅ Conexión a '${dbConfig.database}' establecida`);
        
        // Verificar tablas
        const [tables] = await dbConnection.execute('SHOW TABLES');
        console.log(`📋 Tablas encontradas: ${tables.length}`);
        
        if (tables.length > 0) {
          console.log('📋 Lista de tablas:');
          tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`   - ${tableName}`);
          });
        }
        
        await dbConnection.end();
        console.log('✅ Prueba completada exitosamente');
        
      } else {
        console.log(`❌ Base de datos '${dbConfig.database}' no existe`);
        console.log('💡 Ejecuta el script SQL para crear la base de datos');
      }
      
      await connection.end();
      
    } catch (error) {
      console.error('❌ Error al conectar:', error.message);
      console.error('   Código:', error.code);
      
      if (error.code === 'ECONNREFUSED') {
        console.log('\n💡 Soluciones:');
        console.log('   1. Verifica que XAMPP esté ejecutándose');
        console.log('   2. Confirma que MySQL esté activo');
        console.log('   3. Verifica que el puerto 3306 esté disponible');
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.log('\n💡 Soluciones:');
        console.log('   1. Verifica el usuario y contraseña');
        console.log('   2. Confirma que el usuario tenga permisos');
      }
    }
  }
  
  // Ejecutar la prueba
  testConnection();
  
} catch (error) {
  console.error('❌ Error al cargar mysql2:', error.message);
  console.log('\n💡 Soluciones:');
  console.log('   1. Ejecuta: npm install mysql2');
  console.log('   2. O ejecuta: install-deps.bat');
} 