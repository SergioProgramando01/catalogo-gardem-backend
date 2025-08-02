const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokenAdmin = '';

async function loginAdmin() {
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'admin@gardem.com',
      contraseña: 'admin123'
    });
    tokenAdmin = response.data.token;
    console.log('✅ Login admin exitoso');
  } catch (error) {
    console.error('❌ Error en login admin:', error.response?.data || error.message);
  }
}

async function probarEndpointsEstadosPedido() {
  console.log('🧪 Iniciando pruebas de endpoints del módulo EstadosPedido...\n');

  try {
    // Login solo admin
    await loginAdmin();

    if (!tokenAdmin) {
      console.log('❌ No se pudo obtener token de autenticación');
      return;
    }

    // Primero, obtener un pedido existente
    console.log('0. Obteniendo pedidos existentes...');
    const pedidosResponse = await axios.get(`${BASE_URL}/pedidos`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    
    if (!pedidosResponse.data.pedidos || pedidosResponse.data.pedidos.length === 0) {
      console.log('❌ No hay pedidos en la base de datos');
      console.log('Por favor, crea un pedido primero');
      return;
    }

    const pedidoId = pedidosResponse.data.pedidos[0].id_pedido;
    console.log(`✅ Usando pedido existente: ${pedidoId}`);

    // Datos de prueba usando el pedido real
    const datosEstado = {
      id_pedido: pedidoId,
      estado: 'confirmado',
      comentario: 'Pedido confirmado por el administrador'
    };

    console.log('\n1. Creando estado de pedido (admin)...');
    const crearResponse = await axios.post(`${BASE_URL}/estados-pedido`, datosEstado, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Estado creado:', crearResponse.status, crearResponse.data.mensaje);

    const estadoId = crearResponse.data.estado.id_estado_pedido;

    console.log('\n2. Obteniendo estado por ID...');
    const obtenerResponse = await axios.get(`${BASE_URL}/estados-pedido/${estadoId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Estado obtenido:', obtenerResponse.status);

    console.log('\n3. Obteniendo historial de estados del pedido...');
    const historialResponse = await axios.get(`${BASE_URL}/estados-pedido/pedido/${pedidoId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Historial obtenido:', historialResponse.status, historialResponse.data.total, 'estados');

    console.log('\n4. Obteniendo último estado del pedido...');
    const ultimoResponse = await axios.get(`${BASE_URL}/estados-pedido/pedido/${pedidoId}/ultimo`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Último estado obtenido:', ultimoResponse.status);

    console.log('\n5. Obteniendo estados por estado específico...');
    const porEstadoResponse = await axios.get(`${BASE_URL}/estados-pedido/estado/confirmado`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Estados por estado obtenidos:', porEstadoResponse.status, porEstadoResponse.data.total);

    console.log('\n6. Obteniendo todos los estados (admin)...');
    const todosResponse = await axios.get(`${BASE_URL}/estados-pedido`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Todos los estados obtenidos:', todosResponse.status, todosResponse.data.total);

    console.log('\n7. Obteniendo estadísticas (admin)...');
    const statsResponse = await axios.get(`${BASE_URL}/estados-pedido/admin/estadisticas`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Estadísticas obtenidas:', statsResponse.status);

    console.log('\n8. Verificando acceso sin token...');
    try {
      await axios.get(`${BASE_URL}/estados-pedido`);
      console.log('❌ Debería haber fallado sin token');
    } catch (error) {
      console.log('✅ Acceso denegado correctamente:', error.response.status);
    }

    console.log('\n9. Verificando acceso con token inválido...');
    try {
      await axios.get(`${BASE_URL}/estados-pedido`, {
        headers: { Authorization: 'Bearer token_invalido' }
      });
      console.log('❌ Debería haber fallado con token inválido');
    } catch (error) {
      console.log('✅ Acceso denegado correctamente:', error.response.status);
    }

    console.log('\n10. Eliminando estado de prueba (admin)...');
    const eliminarResponse = await axios.delete(`${BASE_URL}/estados-pedido/${estadoId}`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Estado eliminado:', eliminarResponse.status, eliminarResponse.data.mensaje);

    console.log('\n ¡Todas las pruebas de endpoints fueron exitosas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
probarEndpointsEstadosPedido(); 