const { executeQuery } = require('../../../database/connection');

class Pedido {
  constructor(data = {}) {
    this.id_pedido = data.id_pedido;
    this.id_usuario = data.id_usuario;
    this.id_cesta = data.id_cesta;
    this.numero_pedido = data.numero_pedido;
    this.fecha_pedido = data.fecha_pedido;
    this.fecha_entrega_estimada = data.fecha_entrega_estimada;
    this.estado = data.estado || 'pendiente';
    this.total_pedido = data.total_pedido || 0;
    this.subtotal = data.subtotal || 0;
    this.impuestos = data.impuestos || 0;
    this.descuento = data.descuento || 0;
    this.direccion_entrega = data.direccion_entrega;
    this.telefono_contacto = data.telefono_contacto;
    this.notas = data.notas;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
    
    // Para joins
    this.usuario = data.usuario;
    this.cesta = data.cesta;
    this.items = data.items || [];
    this.estados = data.estados || [];
  }

  /**
   * Crear un nuevo pedido desde una cesta
   */
  static async crearDesdeCesta(cestaId, datosPedido) {
    try {
      // Verificar que la cesta existe y tiene items
      const cesta = await executeQuery(
        `SELECT c.*, COUNT(ic.id_item_cesta) as total_items, SUM(ic.cantidad * vp.precio_adicional + p.precio) as total
         FROM CestaPedido c
         LEFT JOIN ItemsCesta ic ON c.id_cesta = ic.id_cesta
         LEFT JOIN VariantesProducto vp ON ic.id_variante = vp.id_variante
         LEFT JOIN Productos p ON vp.id_producto = p.id_producto
         WHERE c.id_cesta = ? AND c.estado = 'activa'
         GROUP BY c.id_cesta`,
        [cestaId]
      );

      if (!cesta || cesta.length === 0) {
        throw new Error('Cesta no encontrada o no válida');
      }

      if (cesta[0].total_items === 0) {
        throw new Error('No se puede crear un pedido desde una cesta vacía');
      }

      // Generar número de pedido único
      const numeroPedido = await Pedido.generarNumeroPedido();
      
      // Calcular fechas
      const fechaPedido = new Date();
      const fechaEntregaEstimada = new Date();
      fechaEntregaEstimada.setDate(fechaEntregaEstimada.getDate() + 7); // 7 días por defecto

      // Calcular totales
      const subtotal = parseFloat(cesta[0].total) || 0;
      const impuestos = subtotal * 0.19; // 19% IVA
      const descuento = 0; // Por implementar sistema de descuentos
      const totalPedido = subtotal + impuestos - descuento;

      // Crear el pedido
      const resultado = await executeQuery(
        `INSERT INTO Pedidos (
          id_usuario, id_cesta, numero_pedido, fecha_pedido, fecha_entrega_estimada,
          estado, total_pedido, subtotal, impuestos, descuento,
          direccion_entrega, telefono_contacto, notas
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cesta[0].id_usuario,
          cestaId,
          numeroPedido,
          fechaPedido,
          fechaEntregaEstimada,
          'pendiente',
          totalPedido,
          subtotal,
          impuestos,
          descuento,
          datosPedido.direccion_entrega,
          datosPedido.telefono_contacto,
          datosPedido.notas || null
        ]
      );

      const pedidoId = resultado.insertId;

      // Crear items del pedido desde la cesta
      await Pedido.crearItemsDesdeCesta(pedidoId, cestaId);

      // Actualizar estado de la cesta a 'finalizada'
      await executeQuery(
        'UPDATE CestaPedido SET estado = ? WHERE id_cesta = ?',
        ['finalizada', cestaId]
      );

      // Crear primer estado del pedido
      await Pedido.agregarEstado(pedidoId, 'pendiente', 'Pedido creado exitosamente');

      return await Pedido.buscarPorId(pedidoId);
    } catch (error) {
      throw new Error(`Error al crear pedido desde cesta: ${error.message}`);
    }
  }

  /**
   * Generar número de pedido único
   */
  static async generarNumeroPedido() {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    
    // Obtener el último número de secuencia del día
    const resultado = await executeQuery(
      `SELECT COUNT(*) as total FROM Pedidos 
       WHERE DATE(fecha_creacion) = CURDATE()`
    );
    
    const secuencia = (resultado[0].total + 1).toString().padStart(4, '0');
    return `PED${año}${mes}${dia}${secuencia}`;
  }

  /**
   * Crear items del pedido desde la cesta
   */
  static async crearItemsDesdeCesta(pedidoId, cestaId) {
    try {
      const items = await executeQuery(
        `SELECT ic.*, vp.id_producto, p.nombre as nombre_producto, p.precio,
                t.nombre as talla, c.nombre as color, c.codigo_hex
         FROM ItemsCesta ic
         JOIN VariantesProducto vp ON ic.id_variante = vp.id_variante
         JOIN Productos p ON vp.id_producto = p.id_producto
         JOIN Tallas t ON vp.id_talla = t.id_talla
         JOIN Colores c ON vp.id_color = c.id_color
         WHERE ic.id_cesta = ?`,
        [cestaId]
      );

      for (const item of items) {
        const precioUnitario = parseFloat(item.precio) + parseFloat(item.precio_adicional || 0);
        const subtotal = precioUnitario * item.cantidad;

        await executeQuery(
          `INSERT INTO ItemsPedido (
            id_pedido, id_variante, cantidad, precio_unitario, subtotal,
            nombre_producto, talla, color, codigo_color
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            pedidoId,
            item.id_variante,
            item.cantidad,
            precioUnitario,
            subtotal,
            item.nombre_producto,
            item.talla,
            item.color,
            item.codigo_hex
          ]
        );

        // Actualizar stock
        await executeQuery(
          'UPDATE VariantesProducto SET stock = stock - ? WHERE id_variante = ?',
          [item.cantidad, item.id_variante]
        );
      }
    } catch (error) {
      throw new Error(`Error al crear items del pedido: ${error.message}`);
    }
  }

  /**
   * Buscar pedido por ID
   */
  static async buscarPorId(pedidoId) {
    try {
      const resultado = await executeQuery(
        `SELECT p.*, u.nombre_usuario, u.email
         FROM Pedidos p
         JOIN Usuarios u ON p.id_usuario = u.id_usuario
         WHERE p.id_pedido = ?`,
        [pedidoId]
      );

      if (!resultado || resultado.length === 0) {
        return null;
      }

      const pedido = new Pedido(resultado[0]);

      // Obtener items del pedido
      const items = await executeQuery(
        'SELECT * FROM ItemsPedido WHERE id_pedido = ? ORDER BY id_item_pedido',
        [pedidoId]
      );
      pedido.items = items;

      // Obtener estados del pedido
      const estados = await executeQuery(
        'SELECT * FROM EstadosPedido WHERE id_pedido = ? ORDER BY fecha_cambio DESC',
        [pedidoId]
      );
      pedido.estados = estados;

      return pedido;
    } catch (error) {
      throw new Error(`Error al buscar pedido por ID: ${error.message}`);
    }
  }

  /**
   * Obtener pedidos por usuario
   */
  static async obtenerPorUsuario(usuarioId) {
    try {
      const resultado = await executeQuery(
        `SELECT p.*, COUNT(ip.id_item_pedido) as total_items
         FROM Pedidos p
         LEFT JOIN ItemsPedido ip ON p.id_pedido = ip.id_pedido
         WHERE p.id_usuario = ?
         GROUP BY p.id_pedido
         ORDER BY p.fecha_creacion DESC`,
        [usuarioId]
      );

      return resultado.map(row => new Pedido(row));
    } catch (error) {
      throw new Error(`Error al obtener pedidos por usuario: ${error.message}`);
    }
  }

  /**
   * Obtener todos los pedidos (admin)
   */
  static async obtenerTodos() {
    try {
      const resultado = await executeQuery(
        `SELECT p.*, u.nombre_usuario, u.email, COUNT(ip.id_item_pedido) as total_items
         FROM Pedidos p
         JOIN Usuarios u ON p.id_usuario = u.id_usuario
         LEFT JOIN ItemsPedido ip ON p.id_pedido = ip.id_pedido
         GROUP BY p.id_pedido
         ORDER BY p.fecha_creacion DESC`
      );

      return resultado.map(row => new Pedido(row));
    } catch (error) {
      throw new Error(`Error al obtener todos los pedidos: ${error.message}`);
    }
  }

  /**
   * Actualizar estado del pedido
   */
  static async actualizarEstado(pedidoId, nuevoEstado, comentario = '') {
    try {
      // Verificar que el pedido existe
      const pedido = await Pedido.buscarPorId(pedidoId);
      if (!pedido) {
        throw new Error('Pedido no encontrado');
      }

      // Actualizar estado en la tabla principal
      await executeQuery(
        'UPDATE Pedidos SET estado = ?, fecha_actualizacion = NOW() WHERE id_pedido = ?',
        [nuevoEstado, pedidoId]
      );

      // Agregar nuevo estado al historial
      await Pedido.agregarEstado(pedidoId, nuevoEstado, comentario);

      return await Pedido.buscarPorId(pedidoId);
    } catch (error) {
      throw new Error(`Error al actualizar estado del pedido: ${error.message}`);
    }
  }

  /**
   * Agregar estado al historial
   */
  static async agregarEstado(pedidoId, estado, comentario = '') {
    try {
      await executeQuery(
        'INSERT INTO EstadosPedido (id_pedido, estado, comentario) VALUES (?, ?, ?)',
        [pedidoId, estado, comentario]
      );
    } catch (error) {
      throw new Error(`Error al agregar estado al historial: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de pedidos
   */
  static async obtenerEstadisticas() {
    try {
      const estadisticas = await executeQuery(`
        SELECT 
          COUNT(*) as total_pedidos,
          COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pedidos_pendientes,
          COUNT(CASE WHEN estado = 'confirmado' THEN 1 END) as pedidos_confirmados,
          COUNT(CASE WHEN estado = 'enviado' THEN 1 END) as pedidos_enviados,
          COUNT(CASE WHEN estado = 'entregado' THEN 1 END) as pedidos_entregados,
          COUNT(CASE WHEN estado = 'cancelado' THEN 1 END) as pedidos_cancelados,
          SUM(total_pedido) as total_ventas,
          AVG(total_pedido) as promedio_pedido
        FROM Pedidos
        WHERE fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      return estadisticas[0];
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Eliminar pedido (solo admin)
   */
  static async eliminar(pedidoId) {
    try {
      // Verificar que el pedido existe
      const pedido = await Pedido.buscarPorId(pedidoId);
      if (!pedido) {
        throw new Error('Pedido no encontrado');
      }

      // Eliminar en cascada (estados, items, pedido)
      await executeQuery('DELETE FROM EstadosPedido WHERE id_pedido = ?', [pedidoId]);
      await executeQuery('DELETE FROM ItemsPedido WHERE id_pedido = ?', [pedidoId]);
      await executeQuery('DELETE FROM Pedidos WHERE id_pedido = ?', [pedidoId]);

      return true;
    } catch (error) {
      throw new Error(`Error al eliminar pedido: ${error.message}`);
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_pedido: this.id_pedido,
      numero_pedido: this.numero_pedido,
      fecha_pedido: this.fecha_pedido,
      fecha_entrega_estimada: this.fecha_entrega_estimada,
      estado: this.estado,
      total_pedido: this.total_pedido,
      subtotal: this.subtotal,
      impuestos: this.impuestos,
      descuento: this.descuento,
      direccion_entrega: this.direccion_entrega,
      telefono_contacto: this.telefono_contacto,
      notas: this.notas,
      fecha_creacion: this.fecha_creacion,
      fecha_actualizacion: this.fecha_actualizacion,
      usuario: this.usuario ? {
        id_usuario: this.usuario.id_usuario,
        nombre_usuario: this.usuario.nombre_usuario,
        email: this.usuario.email
      } : null,
      items: this.items || [],
      estados: this.estados || []
    };
  }
}

module.exports = Pedido; 