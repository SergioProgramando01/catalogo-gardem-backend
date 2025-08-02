const Talla = require('./src/modules/tallas/models/Talla');

async function test() {
  try {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const nombre = `TALLA_TEST_${timestamp}_${random}`;
    
    console.log('Creando talla:', nombre);
    const talla = await Talla.crear({ nombre });
    console.log('✅ Talla creada:', talla.toPublicObject());
    
    console.log('Eliminando talla...');
    await Talla.eliminar(talla.id_talla);
    console.log('✅ Talla eliminada');
    
    console.log('¡Prueba exitosa!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();