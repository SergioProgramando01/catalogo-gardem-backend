const Talla = require('../models/Talla');

class TallaController {
  /**
   * Obtener todas las tallas
   */
  async obtenerTodas(req, res) {
    try {
      const tallas = await Talla.obtenerTodas();
      res.json({
        tallas: tallas.map(talla => talla.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener tallas',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener talla por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const talla = await Talla.buscarPorId(id);

      if (!talla) {
        return res.status(404).json({
          error: 'Talla no encontrada'
        });
      }

      res.json({
        talla: talla.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener talla',
        mensaje: error.message
      });
    }
  }

  /**
   * Crear nueva talla
   */
  async crear(req, res) {
    try {
      const { nombre } = req.body;

      // Validaciones básicas
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({
          error: 'El nombre de la talla es requerido'
        });
      }

      // Verificar si ya existe una talla con ese nombre
      const tallaExistente = await Talla.buscarPorNombre(nombre.trim());
      if (tallaExistente) {
        return res.status(400).json({
          error: 'Ya existe una talla con ese nombre'
        });
      }

      const nuevaTalla = await Talla.crear({
        nombre: nombre.trim()
      });

      res.status(201).json({
        talla: nuevaTalla.toPublicObject(),
        mensaje: 'Talla creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al crear talla',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar talla
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Verificar que la talla existe
      const tallaExistente = await Talla.buscarPorId(id);
      if (!tallaExistente) {
        return res.status(404).json({
          error: 'Talla no encontrada'
        });
      }

      // Validaciones
      if (datosActualizados.nombre !== undefined) {
        if (!datosActualizados.nombre || datosActualizados.nombre.trim() === '') {
          return res.status(400).json({
            error: 'El nombre de la talla no puede estar vacío'
          });
        }

        // Verificar si el nuevo nombre ya existe en otra talla
        const tallaConMismoNombre = await Talla.buscarPorNombre(datosActualizados.nombre.trim());
        if (tallaConMismoNombre && tallaConMismoNombre.id_talla !== parseInt(id)) {
          return res.status(400).json({
            error: 'Ya existe una talla con ese nombre'
          });
        }
      }

      const tallaActualizada = await Talla.actualizar(id, datosActualizados);
      res.json({
        talla: tallaActualizada.toPublicObject(),
        mensaje: 'Talla actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar talla',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar talla
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la talla existe
      const tallaExistente = await Talla.buscarPorId(id);
      if (!tallaExistente) {
        return res.status(404).json({
          error: 'Talla no encontrada'
        });
      }

      await Talla.eliminar(id);
      res.json({
        mensaje: 'Talla eliminada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al eliminar talla',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener tallas con conteo de productos
   */
  async obtenerConConteo(req, res) {
    try {
      const tallas = await Talla.obtenerConConteoProductos();
      res.json({
        tallas: tallas.map(talla => ({
          id_talla: talla.id_talla,
          nombre: talla.nombre,
          total_productos: talla.total_productos
        }))
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener tallas con conteo',
        mensaje: error.message
      });
    }
  }
}

module.exports = new TallaController();