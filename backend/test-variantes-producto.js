const VarianteProducto = require('./src/modules/variantes-producto/models/VarianteProducto');
const Producto = require('./src/modules/productos/models/Producto');
const Talla = require('./src/modules/tallas/models/Talla');
const Color = require('./src/modules/colores/models/Color');

async function testVariantesProducto() {
  console.log('🧪 Iniciando pruebas del módulo VariantesProducto...\n');

  try {
    // Datos de prueba
    const datosPrueba = {
      id_producto: 1, // Asumiendo que existe un producto con ID 1
      id_talla: 1,    // Asumiendo que existe una talla con ID 1
      id_color: 1,    // Asumiendo que existe un color con ID 1
      stock: 10,
      precio_adicional: 5.00
    };

    console.log('1️⃣ Creando variante de producto...');
    const nuevaVariante = await VarianteProducto.crear(datosPrueba);
    console.log('✅ Variante creada:', nuevaVariante.toPublicObject());

    console.log('\n2️⃣ Buscando variante por ID...');
    const varianteEncontrada = await VarianteProducto.buscarPorId(nuevaVariante.id_variante);
    console.log('✅ Variante encontrada:', varianteEncontrada.toPublicObject());

    console.log('\n3️⃣ Buscando variante por combinación...');
    const varianteCombinacion = await VarianteProducto.buscarPorCombinacion(
      datosPrueba.id_producto,
      datosPrueba.id_talla,
      datosPrueba.id_color
    );
    console.log('✅ Variante por combinación:', varianteCombinacion.toPublicObject());

    console.log('\n4️⃣ Obteniendo variantes por producto...');
    const variantesProducto = await VarianteProducto.obtenerPorProducto(datosPrueba.id_producto);
    console.log('✅ Variantes del producto:', variantesProducto.length);

    console.log('\n5️⃣ Obteniendo todas las variantes...');
    const todasVariantes = await VarianteProducto.obtenerTodas();
    console.log('✅ Total de variantes:', todasVariantes.length);

    console.log('\n6️⃣ Actualizando variante...');
    const varianteActualizada = await VarianteProducto.actualizar(nuevaVariante.id_variante, {
      stock: 15,
      precio_adicional: 7.50
    });
    console.log('✅ Variante actualizada:', varianteActualizada.toPublicObject());

    console.log('\n7️⃣ Actualizando stock...');
    const varianteStockActualizado = await VarianteProducto.actualizarStock(nuevaVariante.id_variante, 5);
    console.log('✅ Stock actualizado:', varianteStockActualizado.toPublicObject());

    console.log('\n8️⃣ Verificando stock...');
    const stockDisponible = await VarianteProducto.verificarStock(nuevaVariante.id_variante, 10);
    console.log('✅ Stock disponible para 10 unidades:', stockDisponible);

    console.log('\n9️⃣ Obteniendo variantes con stock bajo...');
    const variantesStockBajo = await VarianteProducto.obtenerConStockBajo(25);
    console.log('✅ Variantes con stock bajo:', variantesStockBajo.length);

    console.log('\n🔟 Eliminando variante de prueba...');
    await VarianteProducto.eliminar(nuevaVariante.id_variante);
    console.log('✅ Variante eliminada exitosamente');

    console.log('\n✅ Todas las pruebas del módulo VariantesProducto completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testVariantesProducto();