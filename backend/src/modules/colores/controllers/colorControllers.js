const Color = require('../models/Color');

class ColorController {
  /**
   * Obtener todos los colores
   */
  async obtenerTodas(req, res) {
    try {
      const colores = await Color.obtenerTodas();
      res.json({
        colores: colores.map(color => color.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener colores',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener color por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const color = await Color.buscarPorId(id);

      if (!color) {
        return res.status(404).json({
          error: 'Color no encontrado'
        });
      }

      res.json({
        color: color.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener color',
        mensaje: error.message
      });
    }
  }

  /**
   * Crear nuevo color
   */
  async crear(req, res) {
    try {
      const { nombre, codigo_hex } = req.body;

      // Validaciones básicas
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({
          error: 'El nombre del color es requerido'
        });
      }

      if (!codigo_hex || codigo_hex.trim() === '') {
        return res.status(400).json({
          error: 'El código hexadecimal del color es requerido'
        });
      }

      // Validar formato de código hexadecimal
      const hexRegex = /^#[0-9A-F]{6}$/i;
      if (!hexRegex.test(codigo_hex.trim())) {
        return res.status(400).json({
          error: 'El código hexadecimal debe tener el formato #RRGGBB'
        });
      }

      // Verificar si ya existe un color con ese nombre
      const colorExistente = await Color.buscarPorNombre(nombre.trim());
      if (colorExistente) {
        return res.status(400).json({
          error: 'Ya existe un color con ese nombre'
        });
      }

      const nuevoColor = await Color.crear({
        nombre: nombre.trim(),
        codigo_hex: codigo_hex.trim().toUpperCase()
      });

      res.status(201).json({
        color: nuevoColor.toPublicObject(),
        mensaje: 'Color creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al crear color',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar color
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Verificar que el color existe
      const colorExistente = await Color.buscarPorId(id);
      if (!colorExistente) {
        return res.status(404).json({
          error: 'Color no encontrado'
        });
      }

      // Validaciones
      if (datosActualizados.nombre !== undefined) {
        if (!datosActualizados.nombre || datosActualizados.nombre.trim() === '') {
          return res.status(400).json({
            error: 'El nombre del color no puede estar vacío'
          });
        }

        // Verificar si el nuevo nombre ya existe en otro color
        const colorConMismoNombre = await Color.buscarPorNombre(datosActualizados.nombre.trim());
        if (colorConMismoNombre && colorConMismoNombre.id_color !== parseInt(id)) {
          return res.status(400).json({
            error: 'Ya existe un color con ese nombre'
          });
        }
      }

      if (datosActualizados.codigo_hex !== undefined) {
        if (!datosActualizados.codigo_hex || datosActualizados.codigo_hex.trim() === '') {
          return res.status(400).json({
            error: 'El código hexadecimal del color no puede estar vacío'
          });
        }

        // Validar formato de código hexadecimal
        const hexRegex = /^#[0-9A-F]{6}$/i;
        if (!hexRegex.test(datosActualizados.codigo_hex.trim())) {
          return res.status(400).json({
            error: 'El código hexadecimal debe tener el formato #RRGGBB'
          });
        }

        datosActualizados.codigo_hex = datosActualizados.codigo_hex.trim().toUpperCase();
      }

      const colorActualizado = await Color.actualizar(id, datosActualizados);
      res.json({
        color: colorActualizado.toPublicObject(),
        mensaje: 'Color actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar color',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar color
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que el color existe
      const colorExistente = await Color.buscarPorId(id);
      if (!colorExistente) {
        return res.status(404).json({
          error: 'Color no encontrado'
        });
      }

      await Color.eliminar(id);
      res.json({
        mensaje: 'Color eliminado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al eliminar color',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener colores con conteo de productos
   */
  async obtenerConConteo(req, res) {
    try {
      const colores = await Color.obtenerConConteoProductos();
      res.json({
        colores: colores.map(color => ({
          id_color: color.id_color,
          nombre: color.nombre,
          codigo_hex: color.codigo_hex,
          total_productos: color.total_productos
        }))
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener colores con conteo',
        mensaje: error.message
      });
    }
  }
}

module.exports = new ColorController();