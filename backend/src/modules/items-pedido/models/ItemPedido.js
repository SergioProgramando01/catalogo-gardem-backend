const { executeQuery } = require('../../../database/connection');

class ItemPedido {
  constructor(data = {}) {
    this.id_item_pedido = data.id_item_pedido;
    this.id_pedido = data.id_pedido;
    this.id_variante = data.id_variante;
    this.cantidad = data.cantidad;
    this.precio_unitario = data.precio_unitario;
    this.subtotal = data.subtotal;
    this.nombre_producto = data.nombre_producto;
    this.talla = data.talla;
    this.color = data.color;
    this.codigo_color = data.codigo_color;
    this.fecha_creacion = data.fecha_creacion;
    
    // Para joins
    this.pedido = data.pedido;
    this.variante = data.variante;
    this.producto = data.producto;
  }

  /**
   * Crear un nuevo item de pedido
   */
  static async crear(datosItem) {
    try {
      const resultado = await executeQuery(
        `INSERT INTO ItemsPedido (
          id_pedido, id_variante, cantidad, precio_unitario, subtotal,
          nombre_producto, talla, color, codigo_color
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          datosItem.id_pedido,
          datosItem.id_variante,
          datosItem.cantidad,
          datosItem.precio_unitario,
          datosItem.subtotal,
          datosItem.nombre_producto,
          datosItem.talla,
          datosItem.color,
          datosItem.codigo_color
        ]
      );

      return await ItemPedido.buscarPorId(resultado.insertId);
    } catch (error) {
      throw new Error(`Error al crear item de pedido: ${error.message}`);
    }
  }

  /**
   * Buscar item por ID
   */
  static async buscarPorId(itemId) {
    try {
      const resultado = await executeQuery(
        `SELECT ip.*, p.numero_pedido, p.estado as estado_pedido, p.id_usuario,
                vp.id_producto, pr.nombre as nombre_producto_completo,
                pr.descripcion as descripcion_producto
         FROM ItemsPedido ip
         JOIN Pedidos p ON ip.id_pedido = p.id_pedido
         JOIN VariantesProducto vp ON ip.id_variante = vp.id_variante
         JOIN Productos pr ON vp.id_producto = pr.id_producto
         WHERE ip.id_item_pedido = ?`,
        [itemId]
      );

      if (!resultado || resultado.length === 0) {
        return null;
      }

      const item = new ItemPedido(resultado[0]);
      
      // Agregar información del pedido
      item.pedido = {
        id_usuario: resultado[0].id_usuario,
        numero_pedido: resultado[0].numero_pedido,
        estado: resultado[0].estado_pedido
      };
      
      // Agregar información de la variante
      item.variante = {
        id_variante: item.id_variante,
        id_producto: resultado[0].id_producto
      };

      // Agregar información del producto
      item.producto = {
        id_producto: resultado[0].id_producto,
        nombre: resultado[0].nombre_producto_completo,
        descripcion: resultado[0].descripcion_producto
      };

      return item;
    } catch (error) {
      throw new Error(`Error al buscar item de pedido por ID: ${error.message}`);
    }
  }

  /**
   * Obtener items por pedido
   */
  static async obtenerPorPedido(pedidoId) {
    try {
      const resultado = await executeQuery(
        `SELECT ip.*, p.numero_pedido, p.estado as estado_pedido,
                vp.id_producto, pr.nombre as nombre_producto_completo,
                pr.descripcion as descripcion_producto
         FROM ItemsPedido ip
         JOIN Pedidos p ON ip.id_pedido = p.id_pedido
         JOIN VariantesProducto vp ON ip.id_variante = vp.id_variante
         JOIN Productos pr ON vp.id_producto = pr.id_producto
         WHERE ip.id_pedido = ?
         ORDER BY ip.id_item_pedido`,
        [pedidoId]
      );

      return resultado.map(row => {
        const item = new ItemPedido(row);
        // Agregar información de la variante
        item.variante = {
          id_variante: item.id_variante,
          id_producto: row.id_producto
        };
        // Agregar información del producto
        item.producto = {
          id_producto: row.id_producto,
          nombre: row.nombre_producto_completo,
          descripcion: row.descripcion_producto
        };
        return item;
      });
    } catch (error) {
      throw new Error(`Error al obtener items por pedido: ${error.message}`);
    }
  }

  /**
   * Obtener items por usuario
   */
  static async obtenerPorUsuario(usuarioId) {
    try {
      const resultado = await executeQuery(
        `SELECT ip.*, p.numero_pedido, p.estado as estado_pedido,
                p.fecha_pedido, p.total_pedido,
                vp.id_producto, pr.nombre as nombre_producto_completo,
                pr.descripcion as descripcion_producto
         FROM ItemsPedido ip
         JOIN Pedidos p ON ip.id_pedido = p.id_pedido
         JOIN VariantesProducto vp ON ip.id_variante = vp.id_variante
         JOIN Productos pr ON vp.id_producto = pr.id_producto
         WHERE p.id_usuario = ?
         ORDER BY p.fecha_pedido DESC, ip.id_item_pedido`,
        [usuarioId]
      );

      return resultado.map(row => {
        const item = new ItemPedido(row);
        // Agregar información del producto
        item.producto = {
          id_producto: row.id_producto,
          nombre: row.nombre_producto_completo,
          descripcion: row.descripcion_producto
        };
        return item;
      });
    } catch (error) {
      throw new Error(`Error al obtener items por usuario: ${error.message}`);
    }
  }

  /**
   * Obtener todos los items (admin)
   */
  static async obtenerTodos() {
    try {
      const resultado = await executeQuery(
        `SELECT ip.*, p.numero_pedido, p.estado as estado_pedido,
                p.fecha_pedido, p.total_pedido,
                u.nombre_usuario, u.email,
                vp.id_producto, pr.nombre as nombre_producto_completo,
                pr.descripcion as descripcion_producto
         FROM ItemsPedido ip
         JOIN Pedidos p ON ip.id_pedido = p.id_pedido
         JOIN Usuarios u ON p.id_usuario = u.id_usuario
         JOIN VariantesProducto vp ON ip.id_variante = vp.id_variante
         JOIN Productos pr ON vp.id_producto = pr.id_producto
         ORDER BY p.fecha_pedido DESC, ip.id_item_pedido`
      );

      return resultado.map(row => {
        const item = new ItemPedido(row);
        // Agregar información del producto
        item.producto = {
          id_producto: row.id_producto,
          nombre: row.nombre_producto_completo,
          descripcion: row.descripcion_producto
        };
        return item;
      });
    } catch (error) {
      throw new Error(`Error al obtener todos los items: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de items
   */
  static async obtenerEstadisticas() {
    try {
      const estadisticas = await executeQuery(`
        SELECT 
          COUNT(*) as total_items,
          COUNT(DISTINCT id_pedido) as total_pedidos_con_items,
          COUNT(DISTINCT id_variante) as total_variantes_vendidas,
          SUM(cantidad) as total_unidades_vendidas,
          SUM(subtotal) as total_ventas_items,
          AVG(precio_unitario) as precio_promedio,
          AVG(cantidad) as cantidad_promedio_por_item
        FROM ItemsPedido
        WHERE fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      return estadisticas[0];
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Obtener items por variante
   */
  static async obtenerPorVariante(varianteId) {
    try {
      const resultado = await executeQuery(
        `SELECT ip.*, p.numero_pedido, p.estado as estado_pedido,
                p.fecha_pedido, u.nombre_usuario
         FROM ItemsPedido ip
         JOIN Pedidos p ON ip.id_pedido = p.id_pedido
         JOIN Usuarios u ON p.id_usuario = u.id_usuario
         WHERE ip.id_variante = ?
         ORDER BY p.fecha_pedido DESC`,
        [varianteId]
      );

      return resultado.map(row => new ItemPedido(row));
    } catch (error) {
      throw new Error(`Error al obtener items por variante: ${error.message}`);
    }
  }

  /**
   * Obtener items por producto
   */
  static async obtenerPorProducto(productoId) {
    try {
      const resultado = await executeQuery(
        `SELECT ip.*, p.numero_pedido, p.estado as estado_pedido,
                p.fecha_pedido, u.nombre_usuario
         FROM ItemsPedido ip
         JOIN Pedidos p ON ip.id_pedido = p.id_pedido
         JOIN Usuarios u ON p.id_usuario = u.id_usuario
         JOIN VariantesProducto vp ON ip.id_variante = vp.id_variante
         WHERE vp.id_producto = ?
         ORDER BY p.fecha_pedido DESC`,
        [productoId]
      );

      return resultado.map(row => new ItemPedido(row));
    } catch (error) {
      throw new Error(`Error al obtener items por producto: ${error.message}`);
    }
  }

  /**
   * Actualizar item de pedido
   */
  static async actualizar(itemId, datosActualizacion) {
    try {
      const camposPermitidos = ['cantidad', 'precio_unitario', 'subtotal'];
      const camposActualizar = [];
      const valores = [];

      for (const [campo, valor] of Object.entries(datosActualizacion)) {
        if (camposPermitidos.includes(campo)) {
          camposActualizar.push(`${campo} = ?`);
          valores.push(valor);
        }
      }

      if (camposActualizar.length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }

      valores.push(itemId);

      await executeQuery(
        `UPDATE ItemsPedido SET ${camposActualizar.join(', ')} WHERE id_item_pedido = ?`,
        valores
      );

      return await ItemPedido.buscarPorId(itemId);
    } catch (error) {
      throw new Error(`Error al actualizar item de pedido: ${error.message}`);
    }
  }

  /**
   * Eliminar item de pedido
   */
  static async eliminar(itemId) {
    try {
      // Verificar que el item existe
      const item = await ItemPedido.buscarPorId(itemId);
      if (!item) {
        throw new Error('Item de pedido no encontrado');
      }

      await executeQuery(
        'DELETE FROM ItemsPedido WHERE id_item_pedido = ?',
        [itemId]
      );

      return true;
    } catch (error) {
      throw new Error(`Error al eliminar item de pedido: ${error.message}`);
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_item_pedido: this.id_item_pedido,
      id_pedido: this.id_pedido,
      id_variante: this.id_variante,
      cantidad: this.cantidad,
      precio_unitario: this.precio_unitario,
      subtotal: this.subtotal,
      nombre_producto: this.nombre_producto,
      talla: this.talla,
      color: this.color,
      codigo_color: this.codigo_color,
      fecha_creacion: this.fecha_creacion,
      pedido: this.pedido ? {
        numero_pedido: this.pedido.numero_pedido,
        estado: this.pedido.estado,
        fecha_pedido: this.pedido.fecha_pedido,
        total_pedido: this.pedido.total_pedido
      } : null,
      variante: this.variante ? {
        id_variante: this.variante.id_variante,
        id_producto: this.variante.id_producto
      } : null,
      producto: this.producto ? {
        id_producto: this.producto.id_producto,
        nombre: this.producto.nombre,
        descripcion: this.producto.descripcion
      } : null
    };
  }
}

module.exports = ItemPedido; 