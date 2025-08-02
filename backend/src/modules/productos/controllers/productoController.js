const Producto = require('../models/Producto');

class ProductoController {
  /**
   * Obtener todos los productos
   */
  async obtenerTodas(req, res) {
    try {
      const productos = await Producto.obtenerTodas();
      res.json({
        productos: productos.map(producto => producto.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener productos',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener producto por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const producto = await Producto.buscarPorId(id);

      if (!producto) {
        return res.status(404).json({
          error: 'Producto no encontrado'
        });
      }

      res.json({
        producto: producto.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener producto',
        mensaje: error.message
      });
    }
  }

  /**
   * Buscar productos por nombre
   */
  async buscarPorNombre(req, res) {
    try {
      const { nombre } = req.query;
      
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({
          error: 'El parámetro nombre es requerido'
        });
      }

      const productos = await Producto.buscarPorNombre(nombre.trim());
      res.json({
        productos: productos.map(producto => producto.toPublicObject()),
        total: productos.length
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al buscar productos',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener productos por categoría
   */
  async obtenerPorCategoria(req, res) {
    try {
      const { id_categoria } = req.params;
      const productos = await Producto.obtenerPorCategoria(id_categoria);
      
      res.json({
        productos: productos.map(producto => producto.toPublicObject()),
        total: productos.length
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener productos por categoría',
        mensaje: error.message
      });
    }
  }

  /**
   * Crear nuevo producto
   */
  async crear(req, res) {
    try {
      const { nombre, descripcion, precio, id_categoria } = req.body;

      // Validaciones básicas
      if (!nombre || nombre.trim() === '') {
        return res.status(400).json({
          error: 'El nombre del producto es requerido'
        });
      }

      if (!descripcion || descripcion.trim() === '') {
        return res.status(400).json({
          error: 'La descripción del producto es requerida'
        });
      }

      if (!precio || isNaN(precio) || precio <= 0) {
        return res.status(400).json({
          error: 'El precio debe ser un número mayor a 0'
        });
      }

      if (!id_categoria || isNaN(id_categoria)) {
        return res.status(400).json({
          error: 'La categoría es requerida'
        });
      }

      const nuevoProducto = await Producto.crear({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio),
        id_categoria: parseInt(id_categoria)
      });

      res.status(201).json({
        producto: nuevoProducto.toPublicObject(),
        mensaje: 'Producto creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al crear producto',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar producto
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Verificar que el producto existe
      const productoExistente = await Producto.buscarPorId(id);
      if (!productoExistente) {
        return res.status(404).json({
          error: 'Producto no encontrado'
        });
      }

      // Validaciones
      if (datosActualizados.nombre !== undefined) {
        if (!datosActualizados.nombre || datosActualizados.nombre.trim() === '') {
          return res.status(400).json({
            error: 'El nombre del producto no puede estar vacío'
          });
        }
        datosActualizados.nombre = datosActualizados.nombre.trim();
      }

      if (datosActualizados.descripcion !== undefined) {
        if (!datosActualizados.descripcion || datosActualizados.descripcion.trim() === '') {
          return res.status(400).json({
            error: 'La descripción del producto no puede estar vacía'
          });
        }
        datosActualizados.descripcion = datosActualizados.descripcion.trim();
      }

      if (datosActualizados.precio !== undefined) {
        if (isNaN(datosActualizados.precio) || datosActualizados.precio <= 0) {
          return res.status(400).json({
            error: 'El precio debe ser un número mayor a 0'
          });
        }
        datosActualizados.precio = parseFloat(datosActualizados.precio);
      }

      if (datosActualizados.id_categoria !== undefined) {
        if (isNaN(datosActualizados.id_categoria)) {
          return res.status(400).json({
            error: 'La categoría debe ser un ID válido'
          });
        }
        datosActualizados.id_categoria = parseInt(datosActualizados.id_categoria);
      }

      const productoActualizado = await Producto.actualizar(id, datosActualizados);
      res.json({
        producto: productoActualizado.toPublicObject(),
        mensaje: 'Producto actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar producto',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar producto
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que el producto existe
      const productoExistente = await Producto.buscarPorId(id);
      if (!productoExistente) {
        return res.status(404).json({
          error: 'Producto no encontrado'
        });
      }

      await Producto.eliminar(id);
      res.json({
        mensaje: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al eliminar producto',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener productos con conteo de variantes
   */
  async obtenerConConteo(req, res) {
    try {
      const productos = await Producto.obtenerConConteoVariantes();
      res.json({
        productos: productos.map(producto => ({
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          id_categoria: producto.id_categoria,
          fecha_creacion: producto.fecha_creacion,
          categoria: producto.categoria,
          total_variantes: producto.total_variantes
        }))
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener productos con conteo',
        mensaje: error.message
      });
    }
  }
}

module.exports = new ProductoController();