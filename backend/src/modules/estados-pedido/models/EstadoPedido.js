const { executeQuery } = require('../../../database/connection');

class EstadoPedido {
  constructor(data = {}) {
    this.id_estado_pedido = data.id_estado_pedido;
    this.id_pedido = data.id_pedido;
    this.estado = data.estado;
    this.comentario = data.comentario;
    this.fecha_cambio = data.fecha_cambio;
    this.id_usuario = data.id_usuario;
    
    // Para joins
    this.usuario = data.usuario;
    this.pedido = data.pedido;
  }

  /**
   * Crear un nuevo estado de pedido
   */
  static async crear(datos) {
    try {
      const { id_pedido, estado, comentario, id_usuario } = datos;

      // Validar que el pedido existe (usando la estructura actual)
      const pedido = await executeQuery(
        'SELECT id_pedido FROM Pedidos WHERE id_pedido = ?',
        [id_pedido]
      );

      if (!pedido || pedido.length === 0) {
        throw new Error('Pedido no encontrado');
      }

      // Validar que el usuario existe
      const usuario = await executeQuery(
        'SELECT id_usuario FROM Usuarios WHERE id_usuario = ?',
        [id_usuario]
      );

      if (!usuario || usuario.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      // Validar estado válido
      const estadosValidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
      if (!estadosValidos.includes(estado)) {
        throw new Error('Estado no válido');
      }

      // Crear el estado
      const resultado = await executeQuery(
        `INSERT INTO EstadosPedido (
          id_pedido, estado, comentario, id_usuario
        ) VALUES (?, ?, ?, ?)`,
        [id_pedido, estado, comentario || null, id_usuario]
      );

      // Actualizar el estado en la tabla Pedidos
      await executeQuery(
        'UPDATE Pedidos SET estado = ? WHERE id_pedido = ?',
        [estado, id_pedido]
      );

      return await EstadoPedido.buscarPorId(resultado.insertId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar estado por ID
   */
  static async buscarPorId(estadoId) {
    try {
      const resultados = await executeQuery(
        `SELECT ep.*, 
                u.nombre_usuario as usuario_nombre,
                p.numero_pedido as pedido_numero
         FROM EstadosPedido ep
         LEFT JOIN Usuarios u ON ep.id_usuario = u.id_usuario
         LEFT JOIN Pedidos p ON ep.id_pedido = p.id_pedido
         WHERE ep.id_estado_pedido = ?`,
        [estadoId]
      );

      if (resultados.length === 0) {
        return null;
      }

      return new EstadoPedido({
        ...resultados[0],
        usuario: {
          id_usuario: resultados[0].id_usuario,
          nombre_usuario: resultados[0].usuario_nombre
        },
        pedido: {
          id_pedido: resultados[0].id_pedido,
          numero_pedido: resultados[0].pedido_numero
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener historial de estados de un pedido
   */
  static async obtenerPorPedido(pedidoId) {
    try {
      const resultados = await executeQuery(
        `SELECT ep.*, 
                u.nombre_usuario as usuario_nombre,
                p.numero_pedido as pedido_numero
         FROM EstadosPedido ep
         LEFT JOIN Usuarios u ON ep.id_usuario = u.id_usuario
         LEFT JOIN Pedidos p ON ep.id_pedido = p.id_pedido
         WHERE ep.id_pedido = ?
         ORDER BY ep.fecha_cambio DESC`,
        [pedidoId]
      );

      return resultados.map(row => new EstadoPedido({
        ...row,
        usuario: {
          id_usuario: row.id_usuario,
          nombre_usuario: row.usuario_nombre
        },
        pedido: {
          id_pedido: row.id_pedido,
          numero_pedido: row.pedido_numero
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todos los estados
   */
  static async obtenerTodos() {
    try {
      const resultados = await executeQuery(
        `SELECT ep.*, 
                u.nombre_usuario as usuario_nombre,
                p.numero_pedido as pedido_numero
         FROM EstadosPedido ep
         LEFT JOIN Usuarios u ON ep.id_usuario = u.id_usuario
         LEFT JOIN Pedidos p ON ep.id_pedido = p.id_pedido
         ORDER BY ep.fecha_cambio DESC`
      );

      return resultados.map(row => new EstadoPedido({
        ...row,
        usuario: {
          id_usuario: row.id_usuario,
          nombre_usuario: row.usuario_nombre
        },
        pedido: {
          id_pedido: row.id_pedido,
          numero_pedido: row.pedido_numero
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estados por estado específico
   */
  static async obtenerPorEstado(estado) {
    try {
      const resultados = await executeQuery(
        `SELECT ep.*, 
                u.nombre_usuario as usuario_nombre,
                p.numero_pedido as pedido_numero
         FROM EstadosPedido ep
         LEFT JOIN Usuarios u ON ep.id_usuario = u.id_usuario
         LEFT JOIN Pedidos p ON ep.id_pedido = p.id_pedido
         WHERE ep.estado = ?
         ORDER BY ep.fecha_cambio DESC`,
        [estado]
      );

      return resultados.map(row => new EstadoPedido({
        ...row,
        usuario: {
          id_usuario: row.id_usuario,
          nombre_usuario: row.usuario_nombre
        },
        pedido: {
          id_pedido: row.id_pedido,
          numero_pedido: row.pedido_numero
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estados por usuario
   */
  static async obtenerPorUsuario(usuarioId) {
    try {
      const resultados = await executeQuery(
        `SELECT ep.*, 
                u.nombre_usuario as usuario_nombre,
                p.numero_pedido as pedido_numero
         FROM EstadosPedido ep
         LEFT JOIN Usuarios u ON ep.id_usuario = u.id_usuario
         LEFT JOIN Pedidos p ON ep.id_pedido = p.id_pedido
         WHERE ep.id_usuario = ?
         ORDER BY ep.fecha_cambio DESC`,
        [usuarioId]
      );

      return resultados.map(row => new EstadoPedido({
        ...row,
        usuario: {
          id_usuario: row.id_usuario,
          nombre_usuario: row.usuario_nombre
        },
        pedido: {
          id_pedido: row.id_pedido,
          numero_pedido: row.pedido_numero
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener estadísticas de estados
   */
  static async obtenerEstadisticas() {
    try {
      const resultados = await executeQuery(
        `SELECT 
          estado,
          COUNT(*) as total,
          DATE(fecha_cambio) as fecha
         FROM EstadosPedido
         WHERE fecha_cambio >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         GROUP BY estado, DATE(fecha_cambio)
         ORDER BY fecha DESC, estado`
      );

      return resultados;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener último estado de un pedido
   */
  static async obtenerUltimoEstado(pedidoId) {
    try {
      const resultados = await executeQuery(
        `SELECT ep.*, 
                u.nombre_usuario as usuario_nombre,
                p.numero_pedido as pedido_numero
         FROM EstadosPedido ep
         LEFT JOIN Usuarios u ON ep.id_usuario = u.id_usuario
         LEFT JOIN Pedidos p ON ep.id_pedido = p.id_pedido
         WHERE ep.id_pedido = ?
         ORDER BY ep.fecha_cambio DESC
         LIMIT 1`,
        [pedidoId]
      );

      if (resultados.length === 0) {
        return null;
      }

      return new EstadoPedido({
        ...resultados[0],
        usuario: {
          id_usuario: resultados[0].id_usuario,
          nombre_usuario: resultados[0].usuario_nombre
        },
        pedido: {
          id_pedido: resultados[0].id_pedido,
          numero_pedido: resultados[0].pedido_numero
        }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar estado (solo admin)
   */
  static async eliminar(estadoId) {
    try {
      const resultado = await executeQuery(
        'DELETE FROM EstadosPedido WHERE id_estado_pedido = ?',
        [estadoId]
      );

      return resultado.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_estado_pedido: this.id_estado_pedido,
      id_pedido: this.id_pedido,
      estado: this.estado,
      comentario: this.comentario,
      fecha_cambio: this.fecha_cambio,
      id_usuario: this.id_usuario,
      usuario: this.usuario,
      pedido: this.pedido
    };
  }
}

module.exports = EstadoPedido;