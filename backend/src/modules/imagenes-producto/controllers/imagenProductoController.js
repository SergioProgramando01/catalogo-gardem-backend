const ImagenProducto = require('../models/ImagenProducto');
const Producto = require('../../productos/models/Producto');

class ImagenProductoController {
  /**
   * Obtener todas las imágenes
   */
  async obtenerTodas(req, res) {
    try {
      const imagenes = await ImagenProducto.obtenerTodas();
      res.json({
        imagenes: imagenes.map(imagen => imagen.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener imágenes',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener imagen por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const imagen = await ImagenProducto.buscarPorId(id);

      if (!imagen) {
        return res.status(404).json({
          error: 'Imagen no encontrada'
        });
      }

      res.json({
        imagen: imagen.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener imagen',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener imágenes por producto
   */
  async obtenerPorProducto(req, res) {
    try {
      const { productoId } = req.params;
      
      // Verificar que el producto existe
      const producto = await Producto.buscarPorId(productoId);
      if (!producto) {
        return res.status(404).json({
          error: 'Producto no encontrado'
        });
      }

      const imagenes = await ImagenProducto.obtenerPorProducto(productoId);
      res.json({
        producto: producto.toPublicObject(),
        imagenes: imagenes.map(imagen => imagen.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener imágenes del producto',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener imagen principal de un producto
   */
  async obtenerPrincipalPorProducto(req, res) {
    try {
      const { productoId } = req.params;
      
      // Verificar que el producto existe
      const producto = await Producto.buscarPorId(productoId);
      if (!producto) {
        return res.status(404).json({
          error: 'Producto no encontrado'
        });
      }

      const imagen = await ImagenProducto.obtenerPrincipalPorProducto(productoId);
      
      if (!imagen) {
        return res.status(404).json({
          error: 'No se encontró imagen principal para este producto'
        });
      }

      res.json({
        producto: producto.toPublicObject(),
        imagen: imagen.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener imagen principal',
        mensaje: error.message
      });
    }
  }

  /**
   * Crear nueva imagen
   */
  async crear(req, res) {
    try {
      const { id_producto, url_imagen, alt_text, orden, es_principal } = req.body;

      // Validaciones básicas
      if (!id_producto || !url_imagen) {
        return res.status(400).json({
          error: 'El producto y la URL de la imagen son requeridos'
        });
      }

      // Verificar que el producto existe
      const producto = await Producto.buscarPorId(id_producto);
      if (!producto) {
        return res.status(400).json({
          error: 'El producto especificado no existe'
        });
      }

      // Validar URL de imagen
      try {
        new URL(url_imagen);
      } catch (error) {
        return res.status(400).json({
          error: 'La URL de la imagen no es válida'
        });
      }

      // Validar orden
      if (orden !== undefined && (orden < 1 || !Number.isInteger(orden))) {
        return res.status(400).json({
          error: 'El orden debe ser un número entero mayor a 0'
        });
      }

      const nuevaImagen = await ImagenProducto.crear({
        id_producto,
        url_imagen,
        alt_text: alt_text || null,
        orden: orden || 1,
        es_principal: es_principal || false
      });

      res.status(201).json({
        imagen: nuevaImagen.toPublicObject(),
        mensaje: 'Imagen creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al crear imagen',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar imagen
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Verificar que la imagen existe
      const imagenExistente = await ImagenProducto.buscarPorId(id);
      if (!imagenExistente) {
        return res.status(404).json({
          error: 'Imagen no encontrada'
        });
      }

      // Validar URL de imagen si se proporciona
      if (datosActualizados.url_imagen) {
        try {
          new URL(datosActualizados.url_imagen);
        } catch (error) {
          return res.status(400).json({
            error: 'La URL de la imagen no es válida'
          });
        }
      }

      // Validar orden si se proporciona
      if (datosActualizados.orden !== undefined) {
        if (datosActualizados.orden < 1 || !Number.isInteger(datosActualizados.orden)) {
          return res.status(400).json({
            error: 'El orden debe ser un número entero mayor a 0'
          });
        }
      }

      const imagenActualizada = await ImagenProducto.actualizar(id, datosActualizados);

      res.json({
        imagen: imagenActualizada.toPublicObject(),
        mensaje: 'Imagen actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar imagen',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar imagen
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la imagen existe
      const imagen = await ImagenProducto.buscarPorId(id);
      if (!imagen) {
        return res.status(404).json({
          error: 'Imagen no encontrada'
        });
      }

      await ImagenProducto.eliminar(id);

      res.json({
        mensaje: 'Imagen eliminada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al eliminar imagen',
        mensaje: error.message
      });
    }
  }

  /**
   * Reordenar imágenes de un producto
   */
  async reordenarImagenes(req, res) {
    try {
      const { productoId } = req.params;
      const { ordenImagenes } = req.body;

      // Verificar que el producto existe
      const producto = await Producto.buscarPorId(productoId);
      if (!producto) {
        return res.status(404).json({
          error: 'Producto no encontrado'
        });
      }

      // Validar estructura de ordenImagenes
      if (!Array.isArray(ordenImagenes)) {
        return res.status(400).json({
          error: 'ordenImagenes debe ser un array'
        });
      }

      for (const item of ordenImagenes) {
        if (!item.id_imagen || !item.orden || !Number.isInteger(item.orden) || item.orden < 1) {
          return res.status(400).json({
            error: 'Cada elemento debe tener id_imagen y orden (número entero mayor a 0)'
          });
        }
      }

      const imagenesReordenadas = await ImagenProducto.reordenarImagenes(productoId, ordenImagenes);

      res.json({
        imagenes: imagenesReordenadas.map(imagen => imagen.toPublicObject()),
        mensaje: 'Imágenes reordenadas exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al reordenar imágenes',
        mensaje: error.message
      });
    }
  }

  /**
   * Marcar imagen como principal
   */
  async marcarComoPrincipal(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la imagen existe
      const imagen = await ImagenProducto.buscarPorId(id);
      if (!imagen) {
        return res.status(404).json({
          error: 'Imagen no encontrada'
        });
      }

      const imagenActualizada = await ImagenProducto.actualizar(id, { es_principal: true });

      res.json({
        imagen: imagenActualizada.toPublicObject(),
        mensaje: 'Imagen marcada como principal exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al marcar imagen como principal',
        mensaje: error.message
      });
    }
  }

  /**
   * Subir múltiples imágenes para un producto
   */
  async subirMultiplesImagenes(req, res) {
    try {
      const { id_producto } = req.params;
      const { imagenes } = req.body;

      // Verificar que el producto existe
      const producto = await Producto.buscarPorId(id_producto);
      if (!producto) {
        return res.status(404).json({
          error: 'Producto no encontrado'
        });
      }

      // Validar estructura de imágenes
      if (!Array.isArray(imagenes) || imagenes.length === 0) {
        return res.status(400).json({
          error: 'Debe proporcionar al menos una imagen'
        });
      }

      const imagenesCreadas = [];
      let orden = 1;

      for (const imagenData of imagenes) {
        // Validar cada imagen
        if (!imagenData.url_imagen) {
          return res.status(400).json({
            error: 'Cada imagen debe tener una URL'
          });
        }

        // Validar URL
        try {
          new URL(imagenData.url_imagen);
        } catch (error) {
          return res.status(400).json({
            error: `URL inválida: ${imagenData.url_imagen}`
          });
        }

        // Crear imagen
        const nuevaImagen = await ImagenProducto.crear({
          id_producto,
          url_imagen: imagenData.url_imagen,
          alt_text: imagenData.alt_text || null,
          orden: imagenData.orden || orden,
          es_principal: imagenData.es_principal || false
        });

        imagenesCreadas.push(nuevaImagen);
        orden++;
      }

      res.status(201).json({
        imagenes: imagenesCreadas.map(imagen => imagen.toPublicObject()),
        mensaje: `${imagenesCreadas.length} imagen(es) subida(s) exitosamente`
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al subir múltiples imágenes',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener estadísticas de imágenes
   */
  async obtenerEstadisticas(req, res) {
    try {
      const imagenes = await ImagenProducto.obtenerTodas();
      
      const estadisticas = {
        total_imagenes: imagenes.length,
        productos_con_imagenes: new Set(imagenes.map(img => img.id_producto)).size,
        imagenes_principales: imagenes.filter(img => img.es_principal).length,
        imagenes_sin_alt_text: imagenes.filter(img => !img.alt_text).length
      };

      res.json({
        estadisticas
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener estadísticas',
        mensaje: error.message
      });
    }
  }
}

module.exports = new ImagenProductoController();