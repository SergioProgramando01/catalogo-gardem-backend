const Talla = require('./src/modules/tallas/models/Talla'); 
 
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
