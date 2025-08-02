// Script de prueba para el módulo de categorías
// Ejecutar: node test-categorias.js

const Categoria = require('./src/modules/categorias/models/Categoria');

async function probarModuloCategorias() {
  console.log('🧪 Probando módulo de categorías...\n');

  try {
    // 1. Crear una categoría de prueba
    console.log('1️⃣ Creando categoría de prueba...');
    const timestamp = Date.now();
    const datosCategoria = {
      nombre: `Categoría Prueba ${timestamp}`,
      descripcion: 'Descripción de prueba para la categoría',
      activa: true
    };

    const nuevaCategoria = await Categoria.crear(datosCategoria);
    console.log('✅ Categoría creada:', nuevaCategoria.toPublicObject());

    // 2. Buscar categoría por ID
    console.log('\n2️⃣ Buscando categoría por ID...');
    const categoriaEncontrada = await Categoria.buscarPorId(nuevaCategoria.id_categoria);
    console.log('✅ Categoría encontrada:', categoriaEncontrada.toPublicObject());

    // 3. Buscar categoría por nombre
    console.log('\n3️⃣ Buscando categoría por nombre...');
    const categoriaPorNombre = await Categoria.buscarPorNombre(datosCategoria.nombre);
    console.log('✅ Categoría por nombre:', categoriaPorNombre.toPublicObject());

    // 4. Obtener todas las categorías
    console.log('\n4️⃣ Obteniendo todas las categorías...');
    const todasCategorias = await Categoria.obtenerTodas();
    console.log(`✅ Total de categorías: ${todasCategorias.length}`);
    todasCategorias.forEach((categoria, index) => {
      console.log(`   ${index + 1}. ${categoria.nombre} - ${categoria.activa ? 'Activa' : 'Inactiva'}`);
    });

    // 5. Obtener solo categorías activas
    console.log('\n5️⃣ Obteniendo solo categorías activas...');
    const categoriasActivas = await Categoria.obtenerTodas(true);
    console.log(`✅ Total de categorías activas: ${categoriasActivas.length}`);

    // 6. Actualizar categoría
    console.log('\n6️⃣ Actualizando categoría...');
    const datosActualizados = {
      nombre: `Categoría Actualizada ${timestamp}`,
      descripcion: 'Descripción actualizada'
    };
    const categoriaActualizada = await Categoria.actualizar(nuevaCategoria.id_categoria, datosActualizados);
    console.log('✅ Categoría actualizada:', categoriaActualizada.toPublicObject());

    // 7. Desactivar categoría (soft delete)
    console.log('\n7️⃣ Desactivando categoría...');
    await Categoria.eliminar(nuevaCategoria.id_categoria);
    console.log('✅ Categoría desactivada');

    // 8. Verificar que fue eliminada (eliminación permanente)
    console.log('\n8️⃣ Verificando que fue eliminada...');
    const categoriaEliminada = await Categoria.buscarPorId(nuevaCategoria.id_categoria);
    if (categoriaEliminada) {
      console.log('❌ Error: La categoría no fue eliminada');
    } else {
      console.log('✅ Categoría eliminada correctamente');
    }

    // 9. Crear nueva categoría para probar activación
    console.log('\n9️⃣ Creando nueva categoría para probar activación...');
    const nuevaCategoria2 = await Categoria.crear({
      nombre: `Categoría Test ${timestamp}`,
      descripcion: 'Categoría para probar activación'
    });
    console.log('✅ Nueva categoría creada:', nuevaCategoria2.toPublicObject());

    // 10. Obtener categorías con conteo de productos
    console.log('\n🔟 Obteniendo categorías con conteo de productos...');
    const categoriasConConteo = await Categoria.obtenerConConteoProductos();
    console.log(`✅ Total de categorías con conteo: ${categoriasConConteo.length}`);
    categoriasConConteo.forEach((categoria, index) => {
      console.log(`   ${index + 1}. ${categoria.nombre} - ${categoria.total_productos} productos`);
    });

    // 11. Limpiar - eliminar categorías de prueba
    console.log('\n1️⃣1️⃣ Limpiando datos de prueba...');
    await Categoria.eliminarPermanente(nuevaCategoria2.id_categoria);
    console.log('✅ Categorías de prueba eliminadas permanentemente');

    console.log('\n🎉 ¡Todas las pruebas del módulo categorías fueron exitosas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
probarModuloCategorias(); 