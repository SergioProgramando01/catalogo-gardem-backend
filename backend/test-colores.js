// Script de prueba para el módulo de colores
// Ejecutar: node test-colores.js

const Color = require('./src/modules/colores/models/Color');

async function probarModuloColores() {
  console.log(' Probando módulo de colores...\n');

  try {
    // 1. Crear un color de prueba
    console.log('1️⃣ Creando color de prueba...');
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const datosColor = {
      nombre: `COLOR_TEST_${timestamp}_${randomSuffix}`,
      codigo_hex: '#FF0000'
    };

    const nuevoColor = await Color.crear(datosColor);
    console.log('✅ Color creado:', nuevoColor.toPublicObject());

    // 2. Buscar color por ID
    console.log('\n2️⃣ Buscando color por ID...');
    const colorEncontrado = await Color.buscarPorId(nuevoColor.id_color);
    console.log('✅ Color encontrado:', colorEncontrado.toPublicObject());

    // 3. Buscar color por nombre
    console.log('\n3️⃣ Buscando color por nombre...');
    const colorPorNombre = await Color.buscarPorNombre(nuevoColor.nombre);
    console.log('✅ Color por nombre:', colorPorNombre.toPublicObject());

    // 4. Obtener todos los colores
    console.log('\n4️⃣ Obteniendo todos los colores...');
    const todosColores = await Color.obtenerTodas();
    console.log(`✅ Total de colores: ${todosColores.length}`);
    todosColores.forEach((color, index) => {
      console.log(`   ${index + 1}. ${color.nombre} (${color.codigo_hex})`);
    });

    // 5. Actualizar color
    console.log('\n5️⃣ Actualizando color...');
    const datosActualizados = {
      nombre: `COLOR_ACTUALIZADO_${timestamp}_${randomSuffix}`,
      codigo_hex: '#00FF00'
    };
    const colorActualizado = await Color.actualizar(nuevoColor.id_color, datosActualizados);
    console.log('✅ Color actualizado:', colorActualizado.toPublicObject());

    // 6. Obtener colores con conteo de productos
    console.log('\n6️⃣ Obteniendo colores con conteo de productos...');
    const coloresConConteo = await Color.obtenerConConteoProductos();
    console.log(`✅ Total de colores con conteo: ${coloresConConteo.length}`);
    coloresConConteo.forEach((color, index) => {
      console.log(`   ${index + 1}. ${color.nombre} (${color.codigo_hex}) - ${color.total_productos} productos`);
    });

    // 7. Eliminar color
    console.log('\n7️⃣ Eliminando color...');
    await Color.eliminar(nuevoColor.id_color);
    console.log('✅ Color eliminado');

    // 8. Verificar que fue eliminado
    console.log('\n8️⃣ Verificando que fue eliminado...');
    const colorEliminado = await Color.buscarPorId(nuevoColor.id_color);
    if (colorEliminado) {
      console.log('❌ Error: El color no fue eliminado');
    } else {
      console.log('✅ Color eliminado correctamente');
    }

    console.log('\n ¡Todas las pruebas del módulo colores fueron exitosas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
probarModuloColores();