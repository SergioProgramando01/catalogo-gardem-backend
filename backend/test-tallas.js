const Talla = require('./src/modules/tallas/models/Talla');

async function test() {
  try {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const nombre = 'TALLA_TEST_' + timestamp + '_' + random;
    
    console.log('1. Creando talla:', nombre);
    const talla = await Talla.crear({ nombre });
    console.log('Creada:', talla.toPublicObject());
    
    console.log('2. Buscando por ID...');
    const porId = await Talla.buscarPorId(talla.id_talla);
    console.log('Por ID:', porId.toPublicObject());
    
    console.log('3. Buscando por nombre...');
    const porNombre = await Talla.buscarPorNombre(talla.nombre);
    console.log('Por nombre:', porNombre.toPublicObject());
    
    console.log('4. Eliminando...');
    await Talla.eliminar(talla.id_talla);
    console.log('Eliminada');
    
    console.log('Todas las pruebas exitosas!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();