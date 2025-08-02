const Categoria = require('../models/Categoria');

class CategoriaController {
  /**
   * Obtener todas las categorías
   */
  async obtenerTodas(req, res) {
    try {
      const { activas } = req.query;
      let filtroActivas = null;
      
      if (activas !== undefined) {
        filtroActivas = activas === 'true';
      }

      const categorias = await Categoria.obtenerTodas(filtroActivas);
      res.json({
        categorias: categorias.map(categoria => categoria.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener categorías',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener categoría por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.buscarPorId(id);

      if (!categoria) {
        return res.status(404).json({
          error: 'Categoría no encontrada'
        });
      }

      res.json({
        categoria: categoria.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener categoría',
        mensaje: error.message
      });
    }
  }

  /**
   * Crear nueva categoría
   */
  async crear(req, res) {
    try {
      const { nombre, descripcion, activa } = req.body;

      // Validaciones básicas
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({
          error: 'El nombre de la categoría es requerido'
        });
      }

      // Verificar si ya existe una categoría con ese nombre
      const categoriaExistente = await Categoria.buscarPorNombre(nombre.trim());
      if (categoriaExistente) {
        return res.status(400).json({
          error: 'Ya existe una categoría con ese nombre'
        });
      }

      const nuevaCategoria = await Categoria.crear({
        nombre: nombre.trim(),
        descripcion: descripcion ? descripcion.trim() : null,
        activa: activa !== undefined ? activa : true
      });

      res.status(201).json({
        categoria: nuevaCategoria.toPublicObject(),
        mensaje: 'Categoría creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al crear categoría',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar categoría
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Verificar que la categoría existe
      const categoriaExistente = await Categoria.buscarPorId(id);
      if (!categoriaExistente) {
        return res.status(404).json({
          error: 'Categoría no encontrada'
        });
      }

      // Si se está actualizando el nombre, verificar que no exista otro con ese nombre
      if (datosActualizados.nombre && datosActualizados.nombre.trim() !== '') {
        const categoriaConMismoNombre = await Categoria.buscarPorNombre(datosActualizados.nombre.trim());
        if (categoriaConMismoNombre && categoriaConMismoNombre.id_categoria !== parseInt(id)) {
          return res.status(400).json({
            error: 'Ya existe una categoría con ese nombre'
          });
        }
        datosActualizados.nombre = datosActualizados.nombre.trim();
      }

      // Solo permitir actualizar ciertos campos
      const camposPermitidos = ['nombre', 'descripcion', 'activa'];
      const datosFiltrados = {};

      camposPermitidos.forEach(campo => {
        if (datosActualizados[campo] !== undefined) {
          datosFiltrados[campo] = datosActualizados[campo];
        }
      });

      if (Object.keys(datosFiltrados).length === 0) {
        return res.status(400).json({
          error: 'No hay campos válidos para actualizar'
        });
      }

      const categoriaActualizada = await Categoria.actualizar(id, datosFiltrados);
      res.json({
        categoria: categoriaActualizada.toPublicObject(),
        mensaje: 'Categoría actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar categoría',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar categoría (soft delete)
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la categoría existe
      const categoria = await Categoria.buscarPorId(id);
      if (!categoria) {
        return res.status(404).json({
          error: 'Categoría no encontrada'
        });
      }

      await Categoria.eliminar(id);
      res.json({
        mensaje: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al eliminar categoría',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar categoría permanentemente
   */
  async eliminarPermanente(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la categoría existe
      const categoria = await Categoria.buscarPorId(id);
      if (!categoria) {
        return res.status(404).json({
          error: 'Categoría no encontrada'
        });
      }

      await Categoria.eliminarPermanente(id);
      res.json({
        mensaje: 'Categoría eliminada permanentemente'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al eliminar categoría permanentemente',
        mensaje: error.message
      });
    }
  }

  /**
   * Activar categoría
   */
  async activar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la categoría existe
      const categoria = await Categoria.buscarPorId(id);
      if (!categoria) {
        return res.status(404).json({
          error: 'Categoría no encontrada'
        });
      }

      const categoriaActivada = await Categoria.activar(id);
      res.json({
        categoria: categoriaActivada.toPublicObject(),
        mensaje: 'Categoría activada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al activar categoría',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener categorías con conteo de productos
   */
  async obtenerConConteo(req, res) {
    try {
      const categorias = await Categoria.obtenerConConteoProductos();
      res.json({
        categorias: categorias.map(categoria => ({
          ...categoria.toPublicObject(),
          total_productos: categoria.total_productos
        }))
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener categorías con conteo',
        mensaje: error.message
      });
    }
  }
}

module.exports = new CategoriaController(); 