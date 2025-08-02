const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let tokenAdmin = '';
let tokenCliente = '';

async function loginAdmin() {
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'admin@gardem.com',
      contraseña: 'admin123'
    });
    tokenAdmin = response.data.token;
    console.log('✅ Login admin exitoso');
    return true;
  } catch (error) {
    console.error('❌ Error en login admin:', error.response?.data || error.message);
    return false;
  }
}

async function loginCliente() {
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, {
      email: 'cliente@test.com',
      contraseña: 'cliente123'
    });
    tokenCliente = response.data.token;
    console.log('✅ Login cliente exitoso');
    return true;
  } catch (error) {
    console.error('❌ Error en login cliente:', error.response?.data || error.message);
    return false;
  }
}

async function testearHealthCheck() {
  console.log('\n�� 1. Probando Health Check...');
  try {
    const response = await axios.get('http://localhost:3000/health');
    console.log('✅ Health Check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Error en Health Check:', error.message);
    return false;
  }
}

async function testearUsuarios() {
  console.log('\n�� 2. Probando Módulo Usuarios...');
  try {
    // Obtener perfil
    const perfilResponse = await axios.get(`${BASE_URL}/usuarios/perfil`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Perfil obtenido:', perfilResponse.status);

    // Obtener todos los usuarios (admin)
    const usuariosResponse = await axios.get(`${BASE_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Usuarios obtenidos:', usuariosResponse.status, usuariosResponse.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Usuarios:', error.response?.data || error.message);
    return false;
  }
}

async function testearCategorias() {
  console.log('\n�� 3. Probando Módulo Categorías...');
  try {
    const response = await axios.get(`${BASE_URL}/categorias`);
    console.log('✅ Categorías obtenidas:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Categorías:', error.response?.data || error.message);
    return false;
  }
}

async function testearTallas() {
  console.log('\n�� 4. Probando Módulo Tallas...');
  try {
    const response = await axios.get(`${BASE_URL}/tallas`);
    console.log('✅ Tallas obtenidas:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Tallas:', error.response?.data || error.message);
    return false;
  }
}

async function testearColores() {
  console.log('\n�� 5. Probando Módulo Colores...');
  try {
    const response = await axios.get(`${BASE_URL}/colores`);
    console.log('✅ Colores obtenidos:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Colores:', error.response?.data || error.message);
    return false;
  }
}

async function testearProductos() {
  console.log('\n🛍️ 6. Probando Módulo Productos...');
  try {
    const response = await axios.get(`${BASE_URL}/productos`);
    console.log('✅ Productos obtenidos:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Productos:', error.response?.data || error.message);
    return false;
  }
}

async function testearVariantesProducto() {
  console.log('\n�� 7. Probando Módulo Variantes Producto...');
  try {
    const response = await axios.get(`${BASE_URL}/variantes-producto`);
    console.log('✅ Variantes obtenidas:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Variantes Producto:', error.response?.data || error.message);
    return false;
  }
}

async function testearImagenesProducto() {
  console.log('\n🖼️ 8. Probando Módulo Imágenes Producto...');
  try {
    const response = await axios.get(`${BASE_URL}/imagenes-producto`);
    console.log('✅ Imágenes obtenidas:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Imágenes Producto:', error.response?.data || error.message);
    return false;
  }
}

async function testearCestaPedido() {
  console.log('\n�� 9. Probando Módulo Cesta Pedido...');
  try {
    const response = await axios.get(`${BASE_URL}/cesta-pedido`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Cestas obtenidas:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Cesta Pedido:', error.response?.data || error.message);
    return false;
  }
}

async function testearItemsCesta() {
  console.log('\n📦 10. Probando Módulo Items Cesta...');
  try {
    const response = await axios.get(`${BASE_URL}/items-cesta`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Items de cesta obtenidos:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Items Cesta:', error.response?.data || error.message);
    return false;
  }
}

async function testearPedidos() {
  console.log('\n📋 11. Probando Módulo Pedidos...');
  try {
    const response = await axios.get(`${BASE_URL}/pedidos`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Pedidos obtenidos:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Pedidos:', error.response?.data || error.message);
    return false;
  }
}

async function testearItemsPedido() {
  console.log('\n📄 12. Probando Módulo Items Pedido...');
  try {
    const response = await axios.get(`${BASE_URL}/items-pedido`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Items de pedido obtenidos:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Items Pedido:', error.response?.data || error.message);
    return false;
  }
}

async function testearEstadosPedido() {
  console.log('\n🔄 13. Probando Módulo Estados Pedido...');
  try {
    const response = await axios.get(`${BASE_URL}/estados-pedido`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` }
    });
    console.log('✅ Estados de pedido obtenidos:', response.status, response.data.total);
    return true;
  } catch (error) {
    console.error('❌ Error en Estados Pedido:', error.response?.data || error.message);
    return false;
  }
}

async function testearSeguridad() {
  console.log('\n🔒 14. Probando Seguridad...');
  try {
    // Probar acceso sin token
    try {
      await axios.get(`${BASE_URL}/usuarios`);
      console.log('❌ Debería haber fallado sin token');
      return false;
    } catch (error) {
      if (error.response.status === 401) {
        console.log('✅ Acceso denegado sin token (401)');
      }
    }

    // Probar acceso con token inválido
    try {
      await axios.get(`${BASE_URL}/usuarios`, {
        headers: { Authorization: 'Bearer token_invalido' }
      });
      console.log('❌ Debería haber fallado con token inválido');
      return false;
    } catch (error) {
      if (error.response.status === 401) {
        console.log('✅ Acceso denegado con token inválido (401)');
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error en pruebas de seguridad:', error.message);
    return false;
  }
}

async function testearGeneralBackend() {
  console.log('🧪 INICIANDO TESTEO GENERAL DEL BACKEND');
  console.log('=====================================');

  let resultados = {
    healthCheck: false,
    usuarios: false,
    categorias: false,
    tallas: false,
    colores: false,
    productos: false,
    variantesProducto: false,
    imagenesProducto: false,
    cestaPedido: false,
    itemsCesta: false,
    pedidos: false,
    itemsPedido: false,
    estadosPedido: false,
    seguridad: false
  };

  try {
    // Login
    const adminLogin = await loginAdmin();
    const clienteLogin = await loginCliente();

    if (!adminLogin) {
      console.log('❌ No se pudo hacer login como admin');
      return;
    }

    // Health Check
    resultados.healthCheck = await testearHealthCheck();

    // Módulos
    resultados.usuarios = await testearUsuarios();
    resultados.categorias = await testearCategorias();
    resultados.tallas = await testearTallas();
    resultados.colores = await testearColores();
    resultados.productos = await testearProductos();
    resultados.variantesProducto = await testearVariantesProducto();
    resultados.imagenesProducto = await testearImagenesProducto();
    resultados.cestaPedido = await testearCestaPedido();
    resultados.itemsCesta = await testearItemsCesta();
    resultados.pedidos = await testearPedidos();
    resultados.itemsPedido = await testearItemsPedido();
    resultados.estadosPedido = await testearEstadosPedido();
    resultados.seguridad = await testearSeguridad();

    // Resumen
    console.log('\n�� RESUMEN DEL TESTEO GENERAL');
    console.log('=====================================');
    
    const totalTests = Object.keys(resultados).length;
    const testsExitosos = Object.values(resultados).filter(r => r).length;
    const testsFallidos = totalTests - testsExitosos;

    console.log(`✅ Tests exitosos: ${testsExitosos}/${totalTests}`);
    console.log(`❌ Tests fallidos: ${testsFallidos}/${totalTests}`);
    console.log(`📈 Porcentaje de éxito: ${((testsExitosos/totalTests)*100).toFixed(1)}%`);

    console.log('\n📋 DETALLE DE RESULTADOS:');
    Object.entries(resultados).forEach(([modulo, resultado]) => {
      const icono = resultado ? '✅' : '❌';
      const estado = resultado ? 'EXITOSO' : 'FALLIDO';
      console.log(`${icono} ${modulo}: ${estado}`);
    });

    if (testsExitosos === totalTests) {
      console.log('\n�� ¡TODOS LOS MÓDULOS ESTÁN FUNCIONANDO CORRECTAMENTE!');
      console.log('🚀 El backend está listo para producción');
    } else {
      console.log('\n⚠️ Algunos módulos tienen problemas que necesitan atención');
    }

  } catch (error) {
    console.error('❌ Error general en el testeo:', error.message);
  }
}

// Ejecutar testeo general
testearGeneralBackend(); 