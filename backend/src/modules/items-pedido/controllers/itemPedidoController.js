const ItemPedido = require('../models/ItemPedido');
const Pedido = require('../../pedidos/models/Pedido');

class ItemPedidoController {
  /**
   * Obtener items por pedido
   */
  async obtenerPorPedido(req, res) {
    try {
      const { pedidoId } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      // Verificar que el pedido existe
      const pedido = await Pedido.buscarPorId(pedidoId);
      if (!pedido) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }

      // Verificar autorización
      if (!esAdmin && pedido.id_usuario !== usuarioId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo puedes ver los items de tus propios pedidos'
        });
      }

      const items = await ItemPedido.obtenerPorPedido(pedidoId);

      res.json({
        mensaje: 'Items del pedido obtenidos exitosamente',
        items: items.map(item => item.toPublicObject()),
        total: items.length,
        pedido: {
          numero_pedido: pedido.numero_pedido,
          estado: pedido.estado,
          total_pedido: pedido.total_pedido
        }
      });

    } catch (error) {
      console.error('Error al obtener items por pedido:', error);
      res.status(500).json({
        error: 'Error al obtener items por pedido',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener mis items de pedidos
   */
  async obtenerMisItems(req, res) {
    try {
      const usuarioId = req.usuario.id_usuario;
      const items = await ItemPedido.obtenerPorUsuario(usuarioId);

      res.json({
        mensaje: 'Mis items de pedidos obtenidos exitosamente',
        items: items.map(item => item.toPublicObject()),
        total: items.length
      });

    } catch (error) {
      console.error('Error al obtener mis items:', error);
      res.status(500).json({
        error: 'Error al obtener mis items',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener item por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { itemId } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      const item = await ItemPedido.buscarPorId(itemId);
      if (!item) {
        return res.status(404).json({
          error: 'Item de pedido no encontrado'
        });
      }

      // Verificar autorización
      if (!esAdmin && item.pedido.id_usuario !== usuarioId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo puedes ver los items de tus propios pedidos'
        });
      }

      res.json({
        mensaje: 'Item de pedido obtenido exitosamente',
        item: item.toPublicObject()
      });

    } catch (error) {
      console.error('Error al obtener item por ID:', error);
      res.status(500).json({
        error: 'Error al obtener item por ID',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener todos los items (admin)
   */
  async obtenerTodos(req, res) {
    try {
      const items = await ItemPedido.obtenerTodos();

      res.json({
        mensaje: 'Items de pedidos obtenidos exitosamente',
        items: items.map(item => item.toPublicObject()),
        total: items.length
      });

    } catch (error) {
      console.error('Error al obtener todos los items:', error);
      res.status(500).json({
        error: 'Error al obtener todos los items',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener estadísticas de items (admin)
   */
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await ItemPedido.obtenerEstadisticas();

      res.json({
        mensaje: 'Estadísticas de items obtenidas exitosamente',
        estadisticas
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        error: 'Error al obtener estadísticas',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener items por variante
   */
  async obtenerPorVariante(req, res) {
    try {
      const { varianteId } = req.params;
      const items = await ItemPedido.obtenerPorVariante(varianteId);

      res.json({
        mensaje: 'Items por variante obtenidos exitosamente',
        items: items.map(item => item.toPublicObject()),
        total: items.length,
        variante_id: varianteId
      });

    } catch (error) {
      console.error('Error al obtener items por variante:', error);
      res.status(500).json({
        error: 'Error al obtener items por variante',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener items por producto
   */
  async obtenerPorProducto(req, res) {
    try {
      const { productoId } = req.params;
      const items = await ItemPedido.obtenerPorProducto(productoId);

      res.json({
        mensaje: 'Items por producto obtenidos exitosamente',
        items: items.map(item => item.toPublicObject()),
        total: items.length,
        producto_id: productoId
      });

    } catch (error) {
      console.error('Error al obtener items por producto:', error);
      res.status(500).json({
        error: 'Error al obtener items por producto',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar item de pedido
   */
  async actualizar(req, res) {
    try {
      const { itemId } = req.params;
      const { cantidad, precio_unitario } = req.body;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      // Verificar que el item existe
      const item = await ItemPedido.buscarPorId(itemId);
      if (!item) {
        return res.status(404).json({
          error: 'Item de pedido no encontrado'
        });
      }

      // Verificar autorización
      if (!esAdmin && item.pedido.id_usuario !== usuarioId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo puedes actualizar los items de tus propios pedidos'
        });
      }

      // Validar datos
      if (cantidad && cantidad <= 0) {
        return res.status(400).json({
          error: 'Cantidad inválida',
          mensaje: 'La cantidad debe ser mayor a 0'
        });
      }

      if (precio_unitario && precio_unitario <= 0) {
        return res.status(400).json({
          error: 'Precio inválido',
          mensaje: 'El precio debe ser mayor a 0'
        });
      }

      // Calcular subtotal si se actualizan cantidad o precio
      let datosActualizacion = {};
      if (cantidad) datosActualizacion.cantidad = cantidad;
      if (precio_unitario) datosActualizacion.precio_unitario = precio_unitario;
      
      if (cantidad || precio_unitario) {
        const precioFinal = precio_unitario || item.precio_unitario;
        const cantidadFinal = cantidad || item.cantidad;
        datosActualizacion.subtotal = precioFinal * cantidadFinal;
      }

      const itemActualizado = await ItemPedido.actualizar(itemId, datosActualizacion);

      res.json({
        mensaje: 'Item de pedido actualizado exitosamente',
        item: itemActualizado.toPublicObject()
      });

    } catch (error) {
      console.error('Error al actualizar item:', error);
      res.status(500).json({
        error: 'Error al actualizar item',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar item de pedido (admin)
   */
  async eliminar(req, res) {
    try {
      const { itemId } = req.params;

      const item = await ItemPedido.buscarPorId(itemId);
      if (!item) {
        return res.status(404).json({
          error: 'Item de pedido no encontrado'
        });
      }

      await ItemPedido.eliminar(itemId);

      res.json({
        mensaje: 'Item de pedido eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar item:', error);
      res.status(500).json({
        error: 'Error al eliminar item',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener resumen de items por pedido
   */
  async obtenerResumenPorPedido(req, res) {
    try {
      const { pedidoId } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      // Verificar que el pedido existe
      const pedido = await Pedido.buscarPorId(pedidoId);
      if (!pedido) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }

      // Verificar autorización
      if (!esAdmin && pedido.id_usuario !== usuarioId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo puedes ver el resumen de tus propios pedidos'
        });
      }

      const items = await ItemPedido.obtenerPorPedido(pedidoId);

      // Calcular resumen
      const resumen = {
        total_items: items.length,
        total_unidades: items.reduce((sum, item) => sum + item.cantidad, 0),
        total_valor: items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0),
        productos_unicos: [...new Set(items.map(item => item.nombre_producto))].length,
        variantes_unicas: [...new Set(items.map(item => item.id_variante))].length
      };

      res.json({
        mensaje: 'Resumen de items obtenido exitosamente',
        resumen,
        pedido: {
          numero_pedido: pedido.numero_pedido,
          estado: pedido.estado,
          total_pedido: pedido.total_pedido
        }
      });

    } catch (error) {
      console.error('Error al obtener resumen:', error);
      res.status(500).json({
        error: 'Error al obtener resumen',
        mensaje: error.message
      });
    }
  }
}

module.exports = new ItemPedidoController(); 