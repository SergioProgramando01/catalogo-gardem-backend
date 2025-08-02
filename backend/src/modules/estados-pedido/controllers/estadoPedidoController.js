const EstadoPedido = require('../models/EstadoPedido');
const { executeQuery } = require('../../../database/connection');

class EstadoPedidoController {
  /**
   * Crear nuevo estado de pedido
   */
  async crear(req, res) {
    try {
      const { id_pedido, estado, comentario } = req.body;
      const usuarioId = req.usuario.id_usuario;

      // Validar datos requeridos
      if (!id_pedido || !estado) {
        return res.status(400).json({
          error: 'Datos incompletos',
          mensaje: 'El ID del pedido y el estado son obligatorios'
        });
      }

      // Verificar que el pedido existe usando consulta directa
      const pedido = await executeQuery(
        'SELECT id_pedido, id_usuario FROM Pedidos WHERE id_pedido = ?',
        [id_pedido]
      );
      
      if (!pedido || pedido.length === 0) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }

      // Verificar autorización (solo propietario del pedido o admin)
      const esAdmin = req.usuario.rol === 'Administrador';
      if (!esAdmin && pedido[0].id_usuario !== usuarioId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo puedes cambiar el estado de tus propios pedidos'
        });
      }

      // Crear el estado
      const estadoPedido = await EstadoPedido.crear({
        id_pedido,
        estado,
        comentario,
        id_usuario: usuarioId
      });

      res.status(201).json({
        mensaje: 'Estado de pedido creado exitosamente',
        estado: estadoPedido.toPublicObject()
      });

    } catch (error) {
      console.error('Error al crear estado de pedido:', error);
      res.status(500).json({
        error: 'Error al crear estado de pedido',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener historial de estados de un pedido
   */
  async obtenerPorPedido(req, res) {
    try {
      const { pedidoId } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      // Verificar que el pedido existe usando consulta directa
      const pedido = await executeQuery(
        'SELECT id_pedido, id_usuario FROM Pedidos WHERE id_pedido = ?',
        [pedidoId]
      );
      
      if (!pedido || pedido.length === 0) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }

      // Verificar autorización
      if (!esAdmin && pedido[0].id_usuario !== usuarioId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo puedes ver el historial de tus propios pedidos'
        });
      }

      const estados = await EstadoPedido.obtenerPorPedido(pedidoId);

      res.json({
        mensaje: 'Historial de estados obtenido exitosamente',
        estados: estados.map(estado => estado.toPublicObject()),
        total: estados.length
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
   * Obtener todos los estados (admin)
   */
  async obtenerTodos(req, res) {
    try {
      const estados = await EstadoPedido.obtenerTodos();

      res.json({
        mensaje: 'Estados obtenidos exitosamente',
        estados: estados.map(estado => estado.toPublicObject()),
        total: estados.length
      });

    } catch (error) {
      console.error('Error al obtener estados:', error);
      res.status(500).json({
        error: 'Error al obtener estados',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener estados por estado específico
   */
  async obtenerPorEstado(req, res) {
    try {
      const { estado } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      // Si no es admin, solo mostrar estados de sus propios pedidos
      let estados;
      if (esAdmin) {
        estados = await EstadoPedido.obtenerPorEstado(estado);
      } else {
        // Obtener estados de pedidos del usuario
        const estadosUsuario = await EstadoPedido.obtenerPorUsuario(usuarioId);
        estados = estadosUsuario.filter(e => e.estado === estado);
      }

      res.json({
        mensaje: `Estados '${estado}' obtenidos exitosamente`,
        estados: estados.map(estado => estado.toPublicObject()),
        total: estados.length
      });

    } catch (error) {
      console.error('Error al obtener estados por estado:', error);
      res.status(500).json({
        error: 'Error al obtener estados por estado',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener último estado de un pedido
   */
  async obtenerUltimoEstado(req, res) {
    try {
      const { pedidoId } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      // Verificar que el pedido existe usando consulta directa
      const pedido = await executeQuery(
        'SELECT id_pedido, id_usuario FROM Pedidos WHERE id_pedido = ?',
        [pedidoId]
      );
      
      if (!pedido || pedido.length === 0) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }

      // Verificar autorización
      if (!esAdmin && pedido[0].id_usuario !== usuarioId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo puedes ver el estado de tus propios pedidos'
        });
      }

      const ultimoEstado = await EstadoPedido.obtenerUltimoEstado(pedidoId);

      if (!ultimoEstado) {
        return res.status(404).json({
          error: 'No se encontraron estados para este pedido'
        });
      }

      res.json({
        mensaje: 'Último estado obtenido exitosamente',
        estado: ultimoEstado.toPublicObject()
      });

    } catch (error) {
      console.error('Error al obtener último estado:', error);
      res.status(500).json({
        error: 'Error al obtener último estado',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener estadísticas de estados (admin)
   */
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await EstadoPedido.obtenerEstadisticas();

      res.json({
        mensaje: 'Estadísticas obtenidas exitosamente',
        estadisticas,
        total_registros: estadisticas.length
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
   * Obtener estado por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { estadoId } = req.params;
      const usuarioId = req.usuario.id_usuario;
      const esAdmin = req.usuario.rol === 'Administrador';

      const estado = await EstadoPedido.buscarPorId(estadoId);
      if (!estado) {
        return res.status(404).json({
          error: 'Estado no encontrado'
        });
      }

      // Verificar autorización
      if (!esAdmin && estado.id_usuario !== usuarioId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'Solo puedes ver tus propios estados'
        });
      }

      res.json({
        mensaje: 'Estado obtenido exitosamente',
        estado: estado.toPublicObject()
      });

    } catch (error) {
      console.error('Error al obtener estado:', error);
      res.status(500).json({
        error: 'Error al obtener estado',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar estado (admin)
   */
  async eliminar(req, res) {
    try {
      const { estadoId } = req.params;

      // Verificar que el estado existe
      const estado = await EstadoPedido.buscarPorId(estadoId);
      if (!estado) {
        return res.status(404).json({
          error: 'Estado no encontrado'
        });
      }

      const eliminado = await EstadoPedido.eliminar(estadoId);

      if (!eliminado) {
        return res.status(500).json({
          error: 'Error al eliminar estado'
        });
      }

      res.json({
        mensaje: 'Estado eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar estado:', error);
      res.status(500).json({
        error: 'Error al eliminar estado',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener mis estados (cliente)
   */
  async obtenerMisEstados(req, res) {
    try {
      const usuarioId = req.usuario.id_usuario;
      const estados = await EstadoPedido.obtenerPorUsuario(usuarioId);

      res.json({
        mensaje: 'Mis estados obtenidos exitosamente',
        estados: estados.map(estado => estado.toPublicObject()),
        total: estados.length
      });

    } catch (error) {
      console.error('Error al obtener mis estados:', error);
      res.status(500).json({
        error: 'Error al obtener mis estados',
        mensaje: error.message
      });
    }
  }
}

module.exports = new EstadoPedidoController();