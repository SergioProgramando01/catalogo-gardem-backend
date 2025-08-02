const ImagenProducto = require('./src/modules/imagenes-producto/models/ImagenProducto');
const Producto = require('./src/modules/productos/models/Producto');

async function testImagenesProducto() {
  console.log('🧪 Iniciando pruebas del módulo ImagenesProducto...\n');

  try {
    // Datos de prueba
    const datosPrueba = {
      id_producto: 1, // Asumiendo que existe un producto con ID 1
      url_imagen: 'https://example.com/imagen1.jpg',
      alt_text: 'Imagen de prueba del producto',
      orden: 1,
      es_principal: true
    };

    console.log('1️⃣ Creando imagen de producto...');
    const nuevaImagen = await ImagenProducto.crear(datosPrueba);
    console.log('✅ Imagen creada:', nuevaImagen.toPublicObject());

    console.log('\n2️⃣ Buscando imagen por ID...');
    const imagenEncontrada = await ImagenProducto.buscarPorId(nuevaImagen.id_imagen);
    console.log('✅ Imagen encontrada:', imagenEncontrada.toPublicObject());

    console.log('\n3️⃣ Obteniendo imágenes por producto...');
    const imagenesProducto = await ImagenProducto.obtenerPorProducto(datosPrueba.id_producto);
    console.log('✅ Imágenes del producto:', imagenesProducto.length);

    console.log('\n4️⃣ Obteniendo imagen principal...');
    const imagenPrincipal = await ImagenProducto.obtenerPrincipalPorProducto(datosPrueba.id_producto);
    console.log('✅ Imagen principal:', imagenPrincipal.toPublicObject());

    console.log('\n5️⃣ Obteniendo todas las imágenes...');
    const todasImagenes = await ImagenProducto.obtenerTodas();
    console.log('✅ Total de imágenes:', todasImagenes.length);

    console.log('\n6️⃣ Creando segunda imagen...');
    const segundaImagen = await ImagenProducto.crear({
      id_producto: datosPrueba.id_producto,
      url_imagen: 'https://example.com/imagen2.jpg',
      alt_text: 'Segunda imagen de prueba',
      orden: 2,
      es_principal: false
    });
    console.log('✅ Segunda imagen creada');

    console.log('\n7️⃣ Actualizando imagen...');
    const imagenActualizada = await ImagenProducto.actualizar(nuevaImagen.id_imagen, {
      alt_text: 'Imagen actualizada',
      orden: 3
    });
    console.log('✅ Imagen actualizada:', imagenActualizada.toPublicObject());

    console.log('\n8️⃣ Reordenando imágenes...');
    const imagenesReordenadas = await ImagenProducto.reordenarImagenes(datosPrueba.id_producto, [
      { id_imagen: nuevaImagen.id_imagen, orden: 1 },
      { id_imagen: segundaImagen.id_imagen, orden: 2 }
    ]);
    console.log('✅ Imágenes reordenadas:', imagenesReordenadas.length);

    console.log('\n9️⃣ Eliminando segunda imagen...');
    await ImagenProducto.eliminar(segundaImagen.id_imagen);
    console.log('✅ Segunda imagen eliminada');

    console.log('\n🔟 Eliminando imagen principal...');
    await ImagenProducto.eliminar(nuevaImagen.id_imagen);
    console.log('✅ Imagen principal eliminada');

    console.log('\n✅ Todas las pruebas del módulo ImagenesProducto completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testImagenesProducto();