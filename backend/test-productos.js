// Script de prueba para el módulo de productos
// Ejecutar: node test-productos.js

const Producto = require('./src/modules/productos/models/Producto');

async function probarModuloProductos() {
  console.log(' Probando módulo de productos...\n');

  try {
    // 1. Crear un producto de prueba
    console.log('1️⃣ Creando producto de prueba...');
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const datosProducto = {
      nombre: `PRODUCTO_TEST_${timestamp}_${randomSuffix}`,
      descripcion: `Descripción del producto de prueba ${timestamp}`,
      precio: 99.99,
      id_categoria: 1 // Asumiendo que existe una categoría con ID 1
    };

    const nuevoProducto = await Producto.crear(datosProducto);
    console.log('✅ Producto creado:', nuevoProducto.toPublicObject());

    // 2. Buscar producto por ID
    console.log('\n2️⃣ Buscando producto por ID...');
    const productoEncontrado = await Producto.buscarPorId(nuevoProducto.id_producto);
    console.log('✅ Producto encontrado:', productoEncontrado.toPublicObject());

    // 3. Buscar productos por nombre
    console.log('\n3️⃣ Buscando productos por nombre...');
    const productosPorNombre = await Producto.buscarPorNombre('PRODUCTO_TEST');
    console.log(`✅ Productos encontrados por nombre: ${productosPorNombre.length}`);
    productosPorNombre.forEach((producto, index) => {
      console.log(`   ${index + 1}. ${producto.nombre} - $${producto.precio}`);
    });

    // 4. Obtener todos los productos
    console.log('\n4️⃣ Obteniendo todos los productos...');
    const todosProductos = await Producto.obtenerTodas();
    console.log(`✅ Total de productos: ${todosProductos.length}`);
    todosProductos.forEach((producto, index) => {
      console.log(`   ${index + 1}. ${producto.nombre} - $${producto.precio} - Categoría: ${producto.categoria?.nombre || 'Sin categoría'}`);
    });

    // 5. Obtener productos por categoría
    console.log('\n5️⃣ Obteniendo productos por categoría...');
    const productosPorCategoria = await Producto.obtenerPorCategoria(1);
    console.log(`✅ Productos en categoría 1: ${productosPorCategoria.length}`);

    // 6. Actualizar producto
    console.log('\n6️⃣ Actualizando producto...');
    const datosActualizados = {
      nombre: `PRODUCTO_ACTUALIZADO_${timestamp}_${randomSuffix}`,
      descripcion: `Descripción actualizada del producto ${timestamp}`,
      precio: 149.99
    };
    const productoActualizado = await Producto.actualizar(nuevoProducto.id_producto, datosActualizados);
    console.log('✅ Producto actualizado:', productoActualizado.toPublicObject());

    // 7. Obtener productos con conteo de variantes
    console.log('\n7️⃣ Obteniendo productos con conteo de variantes...');
    const productosConConteo = await Producto.obtenerConConteoVariantes();
    console.log(`✅ Total de productos con conteo: ${productosConConteo.length}`);
    productosConConteo.forEach((producto, index) => {
      console.log(`   ${index + 1}. ${producto.nombre} - $${producto.precio} - ${producto.total_variantes} variantes`);
    });

    // 8. Eliminar producto
    console.log('\n8️⃣ Eliminando producto...');
    await Producto.eliminar(nuevoProducto.id_producto);
    console.log('✅ Producto eliminado');

    // 9. Verificar que fue eliminado
    console.log('\n9️⃣ Verificando que fue eliminado...');
    const productoEliminado = await Producto.buscarPorId(nuevoProducto.id_producto);
    if (productoEliminado) {
      console.log('❌ Error: El producto no fue eliminado');
    } else {
      console.log('✅ Producto eliminado correctamente');
    }

    console.log('\n ¡Todas las pruebas del módulo productos fueron exitosas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
probarModuloProductos();