const pedidoController = require('./src/modules/pedidos/controllers/pedidoController');

async function testControladorPedido() {
  console.log('�� Prueba del controlador Pedido...\n');

  try {
    // Simular request y response
    const req = {
      usuario: {
        id_usuario: 1,
        rol: 'Administrador'
      }
    };

    const res = {
      json: (data) => {
        console.log('✅ Respuesta del controlador:', data);
      },
      status: (code) => {
        console.log('📊 Status code:', code);
        return {
          json: (data) => {
            console.log('❌ Error del controlador:', data);
          }
        };
      }
    };

    console.log('1️⃣ Probando obtenerTodos()...');
    await pedidoController.obtenerTodos(req, res);

    console.log('\n2️⃣ Probando obtenerEstadisticas()...');
    await pedidoController.obtenerEstadisticas(req, res);

    console.log('\n✅ Prueba del controlador completada!');

  } catch (error) {
    console.error('❌ Error en la prueba del controlador:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar prueba
testControladorPedido(); 