const CestaPedido = require('../models/CestaPedido');
const Usuario = require('../../usuarios/models/Usuario');

class CestaPedidoController {
  /**
   * Obtener todas las cestas (solo admin)
   */
  async obtenerTodas(req, res) {
    try {
      const cestas = await CestaPedido.obtenerTodas();
      res.json({
        cestas: cestas.map(cesta => cesta.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener cestas',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener cesta por ID (solo admin o propietario)
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const cesta = await CestaPedido.buscarPorId(id);

      if (!cesta) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      // Verificar que el usuario puede acceder a esta cesta
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para acceder a esta cesta'
        });
      }

      res.json({
        cesta: cesta.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener cesta',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener cesta del usuario actual
   */
  async obtenerMiCesta(req, res) {
    try {
      const id_usuario = req.usuario.id_usuario;
      let cesta = await CestaPedido.obtenerPorUsuario(id_usuario);

      // Si no existe, crear una nueva
      if (!cesta) {
        cesta = await CestaPedido.crear(id_usuario);
      }

      res.json({
        cesta: cesta.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener cesta',
        mensaje: error.message
      });
    }
  }

  /**
   * Crear nueva cesta
   */
  async crear(req, res) {
    try {
      const id_usuario = req.usuario.id_usuario;

      // Verificar que el usuario existe
      const usuario = await Usuario.buscarPorId(id_usuario);
      if (!usuario) {
        return res.status(400).json({
          error: 'Usuario no encontrado'
        });
      }

      const cesta = await CestaPedido.crear(id_usuario);

      res.status(201).json({
        cesta: cesta.toPublicObject(),
        mensaje: 'Cesta creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al crear cesta',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar cesta
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Verificar que la cesta existe
      const cestaExistente = await CestaPedido.buscarPorId(id);
      if (!cestaExistente) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      // Verificar que el usuario puede modificar esta cesta
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== cestaExistente.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para modificar esta cesta'
        });
      }

      const cestaActualizada = await CestaPedido.actualizar(id, datosActualizados);

      res.json({
        cesta: cestaActualizada.toPublicObject(),
        mensaje: 'Cesta actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar cesta',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar cesta
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la cesta existe
      const cesta = await CestaPedido.buscarPorId(id);
      if (!cesta) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      // Verificar que el usuario puede eliminar esta cesta
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para eliminar esta cesta'
        });
      }

      await CestaPedido.eliminar(id);

      res.json({
        mensaje: 'Cesta eliminada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al eliminar cesta',
        mensaje: error.message
      });
    }
  }

  /**
   * Vaciar cesta
   */
  async vaciar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la cesta existe
      const cesta = await CestaPedido.buscarPorId(id);
      if (!cesta) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      // Verificar que el usuario puede vaciar esta cesta
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para vaciar esta cesta'
        });
      }

      const itemsEliminados = await CestaPedido.vaciar(id);

      res.json({
        mensaje: `Cesta vaciada exitosamente. ${itemsEliminados} items eliminados`
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al vaciar cesta',
        mensaje: error.message
      });
    }
  }

  /**
   * Finalizar cesta
   */
  async finalizar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la cesta existe
      const cesta = await CestaPedido.buscarPorId(id);
      if (!cesta) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      // Verificar que el usuario puede finalizar esta cesta
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para finalizar esta cesta'
        });
      }

      // Verificar que la cesta tiene items
      if (cesta.items.length === 0) {
        return res.status(400).json({
          error: 'No se puede finalizar una cesta vacía'
        });
      }

      const cestaFinalizada = await CestaPedido.finalizar(id);

      res.json({
        cesta: cestaFinalizada.toPublicObject(),
        mensaje: 'Cesta finalizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al finalizar cesta',
        mensaje: error.message
      });
    }
  }

  /**
   * Calcular total de la cesta
   */
  async calcularTotal(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la cesta existe
      const cesta = await CestaPedido.buscarPorId(id);
      if (!cesta) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      // Verificar que el usuario puede acceder a esta cesta
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para acceder a esta cesta'
        });
      }

      const total = await CestaPedido.calcularTotal(id);

      res.json({
        total
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al calcular total',
        mensaje: error.message
      });
    }
  }
}

module.exports = new CestaPedidoController(); 