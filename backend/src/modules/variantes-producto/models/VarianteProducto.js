const { executeQuery } = require('../../../database/connection');

class VarianteProducto {
  constructor(data = {}) {
    this.id_variante = data.id_variante;
    this.id_producto = data.id_producto;
    this.id_talla = data.id_talla;
    this.id_color = data.id_color;
    this.stock = data.stock;
    this.precio_adicional = data.precio_adicional || 0;
    this.fecha_creacion = data.fecha_creacion;
    
    // Para joins
    this.producto = data.producto;
    this.talla = data.talla;
    this.color = data.color;
  }

  /**
   * Crear una nueva variante de producto
   */
  static async crear(varianteData) {
    try {
      // Verificar que no exista una variante con la misma combinación
      const varianteExistente = await this.buscarPorCombinacion(
        varianteData.id_producto,
        varianteData.id_talla,
        varianteData.id_color
      );

      if (varianteExistente) {
        throw new Error('Ya existe una variante con esta combinación de producto, talla y color');
      }

      const sql = `
        INSERT INTO VariantesProducto (id_producto, id_talla, id_color, stock, precio_adicional)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const params = [
        varianteData.id_producto,
        varianteData.id_talla,
        varianteData.id_color,
        varianteData.stock || 0,
        varianteData.precio_adicional || 0
      ];

      const result = await executeQuery(sql, params);
      return new VarianteProducto({ id_variante: result.insertId, ...varianteData });
    } catch (error) {
      throw new Error(`Error al crear variante de producto: ${error.message}`);
    }
  }

  /**
   * Buscar variante por ID
   */
  static async buscarPorId(id_variante) {
    try {
      const sql = `
        SELECT vp.*, 
               p.nombre as producto_nombre, p.precio as producto_precio,
               t.nombre as talla_nombre,
               c.nombre as color_nombre, c.codigo_hex as color_codigo
        FROM VariantesProducto vp
        LEFT JOIN Productos p ON vp.id_producto = p.id_producto
        LEFT JOIN Tallas t ON vp.id_talla = t.id_talla
        LEFT JOIN Colores c ON vp.id_color = c.id_color
        WHERE vp.id_variante = ?
      `;
      const variantes = await executeQuery(sql, [id_variante]);
      
      if (variantes.length > 0) {
        const variante = variantes[0];
        return new VarianteProducto({
          ...variante,
          producto: {
            id_producto: variante.id_producto,
            nombre: variante.producto_nombre,
            precio: variante.producto_precio
          },
          talla: {
            id_talla: variante.id_talla,
            nombre: variante.talla_nombre
          },
          color: {
            id_color: variante.id_color,
            nombre: variante.color_nombre,
            codigo_hex: variante.color_codigo
          }
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Error al buscar variante por ID: ${error.message}`);
    }
  }

  /**
   * Buscar variante por combinación única
   */
  static async buscarPorCombinacion(id_producto, id_talla, id_color) {
    try {
      const sql = `
        SELECT vp.*, 
               p.nombre as producto_nombre, p.precio as producto_precio,
               t.nombre as talla_nombre,
               c.nombre as color_nombre, c.codigo_hex as color_codigo
        FROM VariantesProducto vp
        LEFT JOIN Productos p ON vp.id_producto = p.id_producto
        LEFT JOIN Tallas t ON vp.id_talla = t.id_talla
        LEFT JOIN Colores c ON vp.id_color = c.id_color
        WHERE vp.id_producto = ? AND vp.id_talla = ? AND vp.id_color = ?
      `;
      const variantes = await executeQuery(sql, [id_producto, id_talla, id_color]);
      
      if (variantes.length > 0) {
        const variante = variantes[0];
        return new VarianteProducto({
          ...variante,
          producto: {
            id_producto: variante.id_producto,
            nombre: variante.producto_nombre,
            precio: variante.producto_precio
          },
          talla: {
            id_talla: variante.id_talla,
            nombre: variante.talla_nombre
          },
          color: {
            id_color: variante.id_color,
            nombre: variante.color_nombre,
            codigo_hex: variante.color_codigo
          }
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Error al buscar variante por combinación: ${error.message}`);
    }
  }

  /**
   * Obtener todas las variantes de un producto
   */
  static async obtenerPorProducto(id_producto) {
    try {
      const sql = `
        SELECT vp.*, 
               p.nombre as producto_nombre, p.precio as producto_precio,
               t.nombre as talla_nombre,
               c.nombre as color_nombre, c.codigo_hex as color_codigo
        FROM VariantesProducto vp
        LEFT JOIN Productos p ON vp.id_producto = p.id_producto
        LEFT JOIN Tallas t ON vp.id_talla = t.id_talla
        LEFT JOIN Colores c ON vp.id_color = c.id_color
        WHERE vp.id_producto = ?
        ORDER BY t.nombre ASC, c.nombre ASC
      `;
      const variantes = await executeQuery(sql, [id_producto]);
      
      return variantes.map(variante => new VarianteProducto({
        ...variante,
        producto: {
          id_producto: variante.id_producto,
          nombre: variante.producto_nombre,
          precio: variante.producto_precio
        },
        talla: {
          id_talla: variante.id_talla,
          nombre: variante.talla_nombre
        },
        color: {
          id_color: variante.id_color,
          nombre: variante.color_nombre,
          codigo_hex: variante.color_codigo
        }
      }));
    } catch (error) {
      throw new Error(`Error al obtener variantes por producto: ${error.message}`);
    }
  }

  /**
   * Obtener todas las variantes
   */
  static async obtenerTodas() {
    try {
      const sql = `
        SELECT vp.*, 
               p.nombre as producto_nombre, p.precio as producto_precio,
               t.nombre as talla_nombre,
               c.nombre as color_nombre, c.codigo_hex as color_codigo
        FROM VariantesProducto vp
        LEFT JOIN Productos p ON vp.id_producto = p.id_producto
        LEFT JOIN Tallas t ON vp.id_talla = t.id_talla
        LEFT JOIN Colores c ON vp.id_color = c.id_color
        ORDER BY p.nombre ASC, t.nombre ASC, c.nombre ASC
      `;
      const variantes = await executeQuery(sql);
      
      return variantes.map(variante => new VarianteProducto({
        ...variante,
        producto: {
          id_producto: variante.id_producto,
          nombre: variante.producto_nombre,
          precio: variante.producto_precio
        },
        talla: {
          id_talla: variante.id_talla,
          nombre: variante.talla_nombre
        },
        color: {
          id_color: variante.id_color,
          nombre: variante.color_nombre,
          codigo_hex: variante.color_codigo
        }
      }));
    } catch (error) {
      throw new Error(`Error al obtener variantes: ${error.message}`);
    }
  }

  /**
   * Actualizar variante
   */
  static async actualizar(id_variante, datosActualizados) {
    try {
      let sql = 'UPDATE VariantesProducto SET ';
      const params = [];
      const campos = [];

      // Construir la consulta dinámicamente
      if (datosActualizados.stock !== undefined) {
        campos.push('stock = ?');
        params.push(datosActualizados.stock);
      }
      if (datosActualizados.precio_adicional !== undefined) {
        campos.push('precio_adicional = ?');
        params.push(datosActualizados.precio_adicional);
      }

      if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      sql += campos.join(', ') + ' WHERE id_variante = ?';
      params.push(id_variante);

      const result = await executeQuery(sql, params);
      
      if (result.affectedRows === 0) {
        throw new Error('Variante no encontrada');
      }

      return await this.buscarPorId(id_variante);
    } catch (error) {
      throw new Error(`Error al actualizar variante: ${error.message}`);
    }
  }

  /**
   * Eliminar variante
   */
  static async eliminar(id_variante) {
    try {
      // Verificar si la variante está en uso en el carrito
      const sqlCheck = `
        SELECT COUNT(*) as count FROM ItemsCesta WHERE id_variante = ?
      `;
      const checkResult = await executeQuery(sqlCheck, [id_variante]);
      
      if (checkResult[0].count > 0) {
        throw new Error('No se puede eliminar la variante porque está en uso en el carrito');
      }

      const sql = 'DELETE FROM VariantesProducto WHERE id_variante = ?';
      const result = await executeQuery(sql, [id_variante]);
      
      if (result.affectedRows === 0) {
        throw new Error('Variante no encontrada');
      }

      return true;
    } catch (error) {
      throw new Error(`Error al eliminar variante: ${error.message}`);
    }
  }

  /**
   * Actualizar stock de una variante
   */
  static async actualizarStock(id_variante, cantidad) {
    try {
      const sql = 'UPDATE VariantesProducto SET stock = stock + ? WHERE id_variante = ?';
      const result = await executeQuery(sql, [cantidad, id_variante]);
      
      if (result.affectedRows === 0) {
        throw new Error('Variante no encontrada');
      }

      return await this.buscarPorId(id_variante);
    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }

  /**
   * Verificar disponibilidad de stock
   */
  static async verificarStock(id_variante, cantidadSolicitada) {
    try {
      const variante = await this.buscarPorId(id_variante);
      if (!variante) {
        throw new Error('Variante no encontrada');
      }
      
      return variante.stock >= cantidadSolicitada;
    } catch (error) {
      throw new Error(`Error al verificar stock: ${error.message}`);
    }
  }

  /**
   * Obtener variantes con stock bajo
   */
  static async obtenerConStockBajo(limiteStock = 5) {
    try {
      const sql = `
        SELECT vp.*, 
               p.nombre as producto_nombre, p.precio as producto_precio,
               t.nombre as talla_nombre,
               c.nombre as color_nombre, c.codigo_hex as color_codigo
        FROM VariantesProducto vp
        LEFT JOIN Productos p ON vp.id_producto = p.id_producto
        LEFT JOIN Tallas t ON vp.id_talla = t.id_talla
        LEFT JOIN Colores c ON vp.id_color = c.id_color
        WHERE vp.stock <= ?
        ORDER BY vp.stock ASC, p.nombre ASC
      `;
      const variantes = await executeQuery(sql, [limiteStock]);
      
      return variantes.map(variante => new VarianteProducto({
        ...variante,
        producto: {
          id_producto: variante.id_producto,
          nombre: variante.producto_nombre,
          precio: variante.producto_precio
        },
        talla: {
          id_talla: variante.id_talla,
          nombre: variante.talla_nombre
        },
        color: {
          id_color: variante.id_color,
          nombre: variante.color_nombre,
          codigo_hex: variante.color_codigo
        }
      }));
    } catch (error) {
      throw new Error(`Error al obtener variantes con stock bajo: ${error.message}`);
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_variante: this.id_variante,
      id_producto: this.id_producto,
      id_talla: this.id_talla,
      id_color: this.id_color,
      stock: this.stock,
      precio_adicional: this.precio_adicional,
      fecha_creacion: this.fecha_creacion,
      producto: this.producto,
      talla: this.talla,
      color: this.color,
      precio_total: this.producto ? this.producto.precio + this.precio_adicional : this.precio_adicional
    };
  }
}

module.exports = VarianteProducto;