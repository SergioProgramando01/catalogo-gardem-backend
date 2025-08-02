const Pedido = require('../models/Pedido');
const CestaPedido = require('../../cesta-pedido/models/CestaPedido');
const Usuario = require('../../usuarios/models/Usuario');

class PedidoController {
  /**
   * Crear pedido desde cesta
   */
  async crearDesdeCesta(req, res) {
    try {
      const { cestaId } = req.params;
      const { direccion_entrega, telefono_contacto, notas } = req.body;
      const usuarioId = req.usuario.id_usuario;

      // Validar datos requeridos
      if (!direccion_entrega || !telefono_contacto) {
        return res.status(400).json({
          error: 'Datos incompletos',
          mensaje: 'La dirección de entrega y teléfono de contacto son obligatorios'
        });
      }

      // Verificar que la cesta pertenece al usuario
      const cesta = await CestaPedido.buscarPorId(cestaId);
      if (!cesta) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      if (cesta.id_usuario !== usuarioId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo puedes crear pedidos desde tu propia cesta'
        });
      }

      // Crear el pedido
      const pedido = await Pedido.crearDesdeCesta(cestaId, {
        direccion_entrega,
        telefono_contacto,
        notas
      });

      res.status(201).json({
        mensaje: 'Pedido creado exitosamente',
        pedido: pedido.toPublicObject()
      });

    } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(500).json({
        error: 'Error al crear pedido',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener mis pedidos
   */
  async obtenerMisPedidos(req, res) {
    try {
      const usuarioId = req.usuario.id_usuario;
      const pedidos = await Pedido.obtenerPorUsuario(usuarioId);

      res.json({
        mensaje: 'Pedidos obtenidos exitosamente',
        pedidos: pedidos.map(pedido => pedido.toPublicObject()),
        total: pedidos.length
      });

    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      res.status(500).json({
        error: 'Error al obtener pedidos',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener pedido por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { pedidoId } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

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
          mensaje: 'Solo puedes ver tus propios pedidos'
        });
      }

      res.json({
        mensaje: 'Pedido obtenido exitosamente',
        pedido: pedido.toPublicObject()
      });

    } catch (error) {
      console.error('Error al obtener pedido:', error);
      res.status(500).json({
        error: 'Error al obtener pedido',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener todos los pedidos (admin)
   */
  async obtenerTodos(req, res) {
    try {
      const pedidos = await Pedido.obtenerTodos();

      res.json({
        mensaje: 'Pedidos obtenidos exitosamente',
        pedidos: pedidos.map(pedido => pedido.toPublicObject()),
        total: pedidos.length
      });

    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      res.status(500).json({
        error: 'Error al obtener pedidos',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar estado del pedido
   */
  async actualizarEstado(req, res) {
    try {
      const { pedidoId } = req.params;
      const { estado, comentario } = req.body;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      // Validar estado
      const estadosValidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          error: 'Estado inválido',
          mensaje: `Los estados válidos son: ${estadosValidos.join(', ')}`
        });
      }

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
          mensaje: 'Solo puedes actualizar tus propios pedidos'
        });
      }

      // Solo admins pueden cambiar a estados avanzados
      if (!esAdmin && ['confirmado', 'enviado', 'entregado'].includes(estado)) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo los administradores pueden cambiar a este estado'
        });
      }

      // Actualizar estado
      const pedidoActualizado = await Pedido.actualizarEstado(pedidoId, estado, comentario);

      res.json({
        mensaje: 'Estado del pedido actualizado exitosamente',
        pedido: pedidoActualizado.toPublicObject()
      });

    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      res.status(500).json({
        error: 'Error al actualizar estado del pedido',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener historial de estados del pedido
   */
  async obtenerHistorialEstados(req, res) {
    try {
      const { pedidoId } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

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
          mensaje: 'Solo puedes ver el historial de tus propios pedidos'
        });
      }

      res.json({
        mensaje: 'Historial de estados obtenido exitosamente',
        historial: pedido.estados || []
      });

    } catch (error) {
      console.error('Error al obtener historial de estados:', error);
      res.status(500).json({
        error: 'Error al obtener historial de estados',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener estadísticas de pedidos (admin)
   */
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await Pedido.obtenerEstadisticas();

      res.json({
        mensaje: 'Estadísticas obtenidas exitosamente',
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
   * Cancelar pedido
   */
  async cancelarPedido(req, res) {
    try {
      const { pedidoId } = req.params;
      const { motivo } = req.body;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

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
          mensaje: 'Solo puedes cancelar tus propios pedidos'
        });
      }

      // Verificar que el pedido se puede cancelar
      if (['entregado', 'cancelado'].includes(pedido.estado)) {
        return res.status(400).json({
          error: 'Pedido no cancelable',
          mensaje: 'No se puede cancelar un pedido que ya fue entregado o cancelado'
        });
      }

      // Cancelar pedido
      const comentario = motivo ? `Cancelado: ${motivo}` : 'Pedido cancelado por el usuario';
      const pedidoCancelado = await Pedido.actualizarEstado(pedidoId, 'cancelado', comentario);

      res.json({
        mensaje: 'Pedido cancelado exitosamente',
        pedido: pedidoCancelado.toPublicObject()
      });

    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      res.status(500).json({
        error: 'Error al cancelar pedido',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar pedido (admin)
   */
  async eliminar(req, res) {
    try {
      const { pedidoId } = req.params;

      const pedido = await Pedido.buscarPorId(pedidoId);
      if (!pedido) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }

      await Pedido.eliminar(pedidoId);

      res.json({
        mensaje: 'Pedido eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      res.status(500).json({
        error: 'Error al eliminar pedido',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener pedidos por estado
   */
  async obtenerPorEstado(req, res) {
    try {
      const { estado } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      // Validar estado
      const estadosValidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          error: 'Estado inválido',
          mensaje: `Los estados válidos son: ${estadosValidos.join(', ')}`
        });
      }

      let pedidos;
      if (esAdmin) {
        // Admin puede ver todos los pedidos por estado
        const { executeQuery } = require('../../../database/connection');
        pedidos = await executeQuery(
          `SELECT p.*, u.nombre_usuario, u.email, COUNT(ip.id_item_pedido) as total_items
           FROM Pedidos p
           JOIN Usuarios u ON p.id_usuario = u.id_usuario
           LEFT JOIN ItemsPedido ip ON p.id_pedido = ip.id_pedido
           WHERE p.estado = ?
           GROUP BY p.id_pedido
           ORDER BY p.fecha_creacion DESC`,
          [estado]
        );
      } else {
        // Usuario solo ve sus pedidos por estado
        const { executeQuery } = require('../../../database/connection');
        pedidos = await executeQuery(
          `SELECT p.*, COUNT(ip.id_item_pedido) as total_items
           FROM Pedidos p
           LEFT JOIN ItemsPedido ip ON p.id_pedido = ip.id_pedido
           WHERE p.id_usuario = ? AND p.estado = ?
           GROUP BY p.id_pedido
           ORDER BY p.fecha_creacion DESC`,
          [usuarioId, estado]
        );
      }

      res.json({
        mensaje: `Pedidos con estado '${estado}' obtenidos exitosamente`,
        pedidos: pedidos.map(pedido => new Pedido(pedido).toPublicObject()),
        total: pedidos.length
      });

    } catch (error) {
      console.error('Error al obtener pedidos por estado:', error);
      res.status(500).json({
        error: 'Error al obtener pedidos por estado',
        mensaje: error.message
      });
    }
  }
}

module.exports = new PedidoController(); 