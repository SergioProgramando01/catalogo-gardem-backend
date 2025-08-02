const VarianteProducto = require('../models/VarianteProducto');
const Producto = require('../../productos/models/Producto');
const Talla = require('../../tallas/models/Talla');
const Color = require('../../colores/models/Color');

class VarianteProductoController {
  /**
   * Obtener todas las variantes
   */
  async obtenerTodas(req, res) {
    try {
      const variantes = await VarianteProducto.obtenerTodas();
      res.json({
        variantes: variantes.map(variante => variante.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener variantes',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener variante por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const variante = await VarianteProducto.buscarPorId(id);

      if (!variante) {
        return res.status(404).json({
          error: 'Variante no encontrada'
        });
      }

      res.json({
        variante: variante.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener variante',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener variantes por producto
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

      const variantes = await VarianteProducto.obtenerPorProducto(productoId);
      res.json({
        producto: producto.toPublicObject(),
        variantes: variantes.map(variante => variante.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener variantes del producto',
        mensaje: error.message
      });
    }
  }

  /**
   * Crear nueva variante
   */
  async crear(req, res) {
    try {
      const { id_producto, id_talla, id_color, stock, precio_adicional } = req.body;

      // Validaciones básicas
      if (!id_producto || !id_talla || !id_color) {
        return res.status(400).json({
          error: 'El producto, talla y color son requeridos'
        });
      }

      // Verificar que el producto existe
      const producto = await Producto.buscarPorId(id_producto);
      if (!producto) {
        return res.status(400).json({
          error: 'El producto especificado no existe'
        });
      }

      // Verificar que la talla existe
      const talla = await Talla.buscarPorId(id_talla);
      if (!talla) {
        return res.status(400).json({
          error: 'La talla especificada no existe'
        });
      }

      // Verificar que el color existe
      const color = await Color.buscarPorId(id_color);
      if (!color) {
        return res.status(400).json({
          error: 'El color especificado no existe'
        });
      }

      // Validar stock
      if (stock !== undefined && (stock < 0 || !Number.isInteger(stock))) {
        return res.status(400).json({
          error: 'El stock debe ser un número entero no negativo'
        });
      }

      // Validar precio adicional
      if (precio_adicional !== undefined && (precio_adicional < 0 || isNaN(precio_adicional))) {
        return res.status(400).json({
          error: 'El precio adicional debe ser un número no negativo'
        });
      }

      const nuevaVariante = await VarianteProducto.crear({
        id_producto,
        id_talla,
        id_color,
        stock: stock || 0,
        precio_adicional: precio_adicional || 0
      });

      res.status(201).json({
        variante: nuevaVariante.toPublicObject(),
        mensaje: 'Variante creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al crear variante',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar variante
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Verificar que la variante existe
      const varianteExistente = await VarianteProducto.buscarPorId(id);
      if (!varianteExistente) {
        return res.status(404).json({
          error: 'Variante no encontrada'
        });
      }

      // Validar stock si se proporciona
      if (datosActualizados.stock !== undefined) {
        if (datosActualizados.stock < 0 || !Number.isInteger(datosActualizados.stock)) {
          return res.status(400).json({
            error: 'El stock debe ser un número entero no negativo'
          });
        }
      }

      // Validar precio adicional si se proporciona
      if (datosActualizados.precio_adicional !== undefined) {
        if (datosActualizados.precio_adicional < 0 || isNaN(datosActualizados.precio_adicional)) {
          return res.status(400).json({
            error: 'El precio adicional debe ser un número no negativo'
          });
        }
      }

      const varianteActualizada = await VarianteProducto.actualizar(id, datosActualizados);

      res.json({
        variante: varianteActualizada.toPublicObject(),
        mensaje: 'Variante actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar variante',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar variante
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la variante existe
      const variante = await VarianteProducto.buscarPorId(id);
      if (!variante) {
        return res.status(404).json({
          error: 'Variante no encontrada'
        });
      }

      await VarianteProducto.eliminar(id);

      res.json({
        mensaje: 'Variante eliminada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al eliminar variante',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar stock de una variante
   */
  async actualizarStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;

      // Validaciones
      if (cantidad === undefined || isNaN(cantidad)) {
        return res.status(400).json({
          error: 'La cantidad es requerida y debe ser un número'
        });
      }

      // Verificar que la variante existe
      const variante = await VarianteProducto.buscarPorId(id);
      if (!variante) {
        return res.status(404).json({
          error: 'Variante no encontrada'
        });
      }

      // Verificar que no se quede con stock negativo
      if (variante.stock + cantidad < 0) {
        return res.status(400).json({
          error: 'No se puede reducir el stock por debajo de 0'
        });
      }

      const varianteActualizada = await VarianteProducto.actualizarStock(id, cantidad);

      res.json({
        variante: varianteActualizada.toPublicObject(),
        mensaje: 'Stock actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar stock',
        mensaje: error.message
      });
    }
  }

  /**
   * Verificar disponibilidad de stock
   */
  async verificarStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.query;

      // Validaciones
      if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({
          error: 'La cantidad es requerida y debe ser un número positivo'
        });
      }

      const disponible = await VarianteProducto.verificarStock(id, parseInt(cantidad));

      res.json({
        disponible,
        cantidad_solicitada: parseInt(cantidad)
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al verificar stock',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener variantes con stock bajo
   */
  async obtenerConStockBajo(req, res) {
    try {
      const { limite = 5 } = req.query;
      
      if (isNaN(limite) || limite < 0) {
        return res.status(400).json({
          error: 'El límite debe ser un número no negativo'
        });
      }

      const variantes = await VarianteProducto.obtenerConStockBajo(parseInt(limite));
      
      res.json({
        variantes: variantes.map(variante => variante.toPublicObject()),
        limite_stock: parseInt(limite)
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener variantes con stock bajo',
        mensaje: error.message
      });
    }
  }
}

module.exports = new VarianteProductoController();