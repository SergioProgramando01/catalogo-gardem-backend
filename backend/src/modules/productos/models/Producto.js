const { executeQuery } = require('../../../database/connection');

class Producto {
  constructor(data = {}) {
    this.id_producto = data.id_producto;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.precio = data.precio;
    this.id_categoria = data.id_categoria;
    this.fecha_creacion = data.fecha_creacion;
    this.categoria = data.categoria; // Para joins
  }

  /**
   * Crear un nuevo producto
   */
  static async crear(productoData) {
    try {
      const sql = `
        INSERT INTO Productos (nombre, descripcion, precio, id_categoria)
        VALUES (?, ?, ?, ?)
      `;
      
      const params = [
        productoData.nombre,
        productoData.descripcion,
        productoData.precio,
        productoData.id_categoria
      ];

      const result = await executeQuery(sql, params);
      return new Producto({ id_producto: result.insertId, ...productoData });
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  /**
   * Buscar producto por ID
   */
  static async buscarPorId(id_producto) {
    try {
      const sql = `
        SELECT p.*, c.nombre as categoria_nombre
        FROM Productos p
        LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
        WHERE p.id_producto = ?
      `;
      const productos = await executeQuery(sql, [id_producto]);
      
      if (productos.length > 0) {
        const producto = productos[0];
        return new Producto({
          ...producto,
          categoria: {
            id_categoria: producto.id_categoria,
            nombre: producto.categoria_nombre
          }
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Error al buscar producto por ID: ${error.message}`);
    }
  }

  /**
   * Buscar productos por nombre
   */
  static async buscarPorNombre(nombre) {
    try {
      const sql = `
        SELECT p.*, c.nombre as categoria_nombre
        FROM Productos p
        LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
        WHERE p.nombre LIKE ?
        ORDER BY p.nombre ASC
      `;
      const productos = await executeQuery(sql, [`%${nombre}%`]);
      
      return productos.map(producto => new Producto({
        ...producto,
        categoria: {
          id_categoria: producto.id_categoria,
          nombre: producto.categoria_nombre
        }
      }));
    } catch (error) {
      throw new Error(`Error al buscar productos por nombre: ${error.message}`);
    }
  }

  /**
   * Obtener todos los productos
   */
  static async obtenerTodas() {
    try {
      const sql = `
        SELECT p.*, c.nombre as categoria_nombre
        FROM Productos p
        LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
        ORDER BY p.fecha_creacion DESC
      `;
      const productos = await executeQuery(sql);
      
      return productos.map(producto => new Producto({
        ...producto,
        categoria: {
          id_categoria: producto.id_categoria,
          nombre: producto.categoria_nombre
        }
      }));
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  /**
   * Obtener productos por categoría
   */
  static async obtenerPorCategoria(id_categoria) {
    try {
      const sql = `
        SELECT p.*, c.nombre as categoria_nombre
        FROM Productos p
        LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
        WHERE p.id_categoria = ?
        ORDER BY p.fecha_creacion DESC
      `;
      const productos = await executeQuery(sql, [id_categoria]);
      
      return productos.map(producto => new Producto({
        ...producto,
        categoria: {
          id_categoria: producto.id_categoria,
          nombre: producto.categoria_nombre
        }
      }));
    } catch (error) {
      throw new Error(`Error al obtener productos por categoría: ${error.message}`);
    }
  }

  /**
   * Actualizar producto
   */
  static async actualizar(id_producto, datosActualizados) {
    try {
      let sql = 'UPDATE Productos SET ';
      const params = [];
      const campos = [];

      // Construir la consulta dinámicamente
      if (datosActualizados.nombre !== undefined) {
        campos.push('nombre = ?');
        params.push(datosActualizados.nombre);
      }

      if (datosActualizados.descripcion !== undefined) {
        campos.push('descripcion = ?');
        params.push(datosActualizados.descripcion);
      }

      if (datosActualizados.precio !== undefined) {
        campos.push('precio = ?');
        params.push(datosActualizados.precio);
      }

      if (datosActualizados.id_categoria !== undefined) {
        campos.push('id_categoria = ?');
        params.push(datosActualizados.id_categoria);
      }

      if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      sql += campos.join(', ') + ' WHERE id_producto = ?';
      params.push(id_producto);

      await executeQuery(sql, params);
      return await this.buscarPorId(id_producto);
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  /**
   * Eliminar producto
   */
  static async eliminar(id_producto) {
    try {
      // Verificar si el producto tiene variantes asociadas
      const sqlCheck = `
        SELECT COUNT(*) as count 
        FROM VariantesProducto 
        WHERE id_producto = ?
      `;
      const result = await executeQuery(sqlCheck, [id_producto]);
      
      if (result[0].count > 0) {
        throw new Error('No se puede eliminar el producto porque tiene variantes asociadas');
      }

      const sql = 'DELETE FROM Productos WHERE id_producto = ?';
      await executeQuery(sql, [id_producto]);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  /**
   * Obtener productos con conteo de variantes
   */
  static async obtenerConConteoVariantes() {
    try {
      const sql = `
        SELECT 
          p.*,
          c.nombre as categoria_nombre,
          COUNT(DISTINCT vp.id_variante) as total_variantes
        FROM Productos p
        LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
        LEFT JOIN VariantesProducto vp ON p.id_producto = vp.id_producto
        GROUP BY p.id_producto
        ORDER BY p.fecha_creacion DESC
      `;
      
      const productos = await executeQuery(sql);
      return productos.map(producto => {
        const productoObj = new Producto({
          ...producto,
          categoria: {
            id_categoria: producto.id_categoria,
            nombre: producto.categoria_nombre
          }
        });
        productoObj.total_variantes = parseInt(producto.total_variantes);
        return productoObj;
      });
    } catch (error) {
      throw new Error(`Error al obtener productos con conteo: ${error.message}`);
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_producto: this.id_producto,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      id_categoria: this.id_categoria,
      fecha_creacion: this.fecha_creacion,
      categoria: this.categoria
    };
  }
}

module.exports = Producto;