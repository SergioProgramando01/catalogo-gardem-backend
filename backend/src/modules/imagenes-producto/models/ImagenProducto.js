const { executeQuery } = require('../../../database/connection');

class ImagenProducto {
  constructor(data = {}) {
    this.id_imagen = data.id_imagen;
    this.id_producto = data.id_producto;
    this.url_imagen = data.url_imagen;
    this.alt_text = data.alt_text;
    this.orden = data.orden || 1;
    this.es_principal = data.es_principal || false;
    this.fecha_creacion = data.fecha_creacion;
    
    // Para joins
    this.producto = data.producto;
  }

  /**
   * Crear una nueva imagen de producto
   */
  static async crear(imagenData) {
    try {
      // Si es la imagen principal, desactivar otras imágenes principales del producto
      if (imagenData.es_principal) {
        await this.desactivarImagenesPrincipales(imagenData.id_producto);
      }

      const sql = `
        INSERT INTO ImagenesProducto (id_producto, url_imagen, alt_text, orden, es_principal)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const params = [
        imagenData.id_producto,
        imagenData.url_imagen,
        imagenData.alt_text || null,
        imagenData.orden || 1,
        imagenData.es_principal || false
      ];

      const result = await executeQuery(sql, params);
      return new ImagenProducto({ id_imagen: result.insertId, ...imagenData });
    } catch (error) {
      throw new Error(`Error al crear imagen de producto: ${error.message}`);
    }
  }

  /**
   * Buscar imagen por ID
   */
  static async buscarPorId(id_imagen) {
    try {
      const sql = `
        SELECT i.*, p.nombre as producto_nombre
        FROM ImagenesProducto i
        LEFT JOIN Productos p ON i.id_producto = p.id_producto
        WHERE i.id_imagen = ?
      `;
      const imagenes = await executeQuery(sql, [id_imagen]);
      
      if (imagenes.length > 0) {
        const imagen = imagenes[0];
        return new ImagenProducto({
          ...imagen,
          producto: {
            id_producto: imagen.id_producto,
            nombre: imagen.producto_nombre
          }
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Error al buscar imagen por ID: ${error.message}`);
    }
  }

  /**
   * Obtener todas las imágenes de un producto
   */
  static async obtenerPorProducto(id_producto) {
    try {
      const sql = `
        SELECT i.*, p.nombre as producto_nombre
        FROM ImagenesProducto i
        LEFT JOIN Productos p ON i.id_producto = p.id_producto
        WHERE i.id_producto = ?
        ORDER BY i.orden ASC, i.fecha_creacion ASC
      `;
      const imagenes = await executeQuery(sql, [id_producto]);
      
      return imagenes.map(imagen => new ImagenProducto({
        ...imagen,
        producto: {
          id_producto: imagen.id_producto,
          nombre: imagen.producto_nombre
        }
      }));
    } catch (error) {
      throw new Error(`Error al obtener imágenes por producto: ${error.message}`);
    }
  }

  /**
   * Obtener imagen principal de un producto
   */
  static async obtenerPrincipalPorProducto(id_producto) {
    try {
      const sql = `
        SELECT i.*, p.nombre as producto_nombre
        FROM ImagenesProducto i
        LEFT JOIN Productos p ON i.id_producto = p.id_producto
        WHERE i.id_producto = ? AND i.es_principal = true
        LIMIT 1
      `;
      const imagenes = await executeQuery(sql, [id_producto]);
      
      if (imagenes.length > 0) {
        const imagen = imagenes[0];
        return new ImagenProducto({
          ...imagen,
          producto: {
            id_producto: imagen.id_producto,
            nombre: imagen.producto_nombre
          }
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Error al obtener imagen principal: ${error.message}`);
    }
  }

  /**
   * Obtener todas las imágenes
   */
  static async obtenerTodas() {
    try {
      const sql = `
        SELECT i.*, p.nombre as producto_nombre
        FROM ImagenesProducto i
        LEFT JOIN Productos p ON i.id_producto = p.id_producto
        ORDER BY p.nombre ASC, i.orden ASC
      `;
      const imagenes = await executeQuery(sql);
      
      return imagenes.map(imagen => new ImagenProducto({
        ...imagen,
        producto: {
          id_producto: imagen.id_producto,
          nombre: imagen.producto_nombre
        }
      }));
    } catch (error) {
      throw new Error(`Error al obtener imágenes: ${error.message}`);
    }
  }

  /**
   * Actualizar imagen
   */
  static async actualizar(id_imagen, datosActualizados) {
    try {
      // Si se está marcando como principal, desactivar otras imágenes principales
      if (datosActualizados.es_principal) {
        const imagenActual = await this.buscarPorId(id_imagen);
        if (imagenActual) {
          await this.desactivarImagenesPrincipales(imagenActual.id_producto);
        }
      }

      let sql = 'UPDATE ImagenesProducto SET ';
      const params = [];
      const campos = [];

      // Construir la consulta dinámicamente
      if (datosActualizados.url_imagen !== undefined) {
        campos.push('url_imagen = ?');
        params.push(datosActualizados.url_imagen);
      }
      if (datosActualizados.alt_text !== undefined) {
        campos.push('alt_text = ?');
        params.push(datosActualizados.alt_text);
      }
      if (datosActualizados.orden !== undefined) {
        campos.push('orden = ?');
        params.push(datosActualizados.orden);
      }
      if (datosActualizados.es_principal !== undefined) {
        campos.push('es_principal = ?');
        params.push(datosActualizados.es_principal);
      }

      if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      sql += campos.join(', ') + ' WHERE id_imagen = ?';
      params.push(id_imagen);

      const result = await executeQuery(sql, params);
      
      if (result.affectedRows === 0) {
        throw new Error('Imagen no encontrada');
      }

      return await this.buscarPorId(id_imagen);
    } catch (error) {
      throw new Error(`Error al actualizar imagen: ${error.message}`);
    }
  }

  /**
   * Eliminar imagen
   */
  static async eliminar(id_imagen) {
    try {
      const sql = 'DELETE FROM ImagenesProducto WHERE id_imagen = ?';
      const result = await executeQuery(sql, [id_imagen]);
      
      if (result.affectedRows === 0) {
        throw new Error('Imagen no encontrada');
      }

      return true;
    } catch (error) {
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }
  }

  /**
   * Desactivar imágenes principales de un producto
   */
  static async desactivarImagenesPrincipales(id_producto) {
    try {
      const sql = 'UPDATE ImagenesProducto SET es_principal = false WHERE id_producto = ?';
      await executeQuery(sql, [id_producto]);
    } catch (error) {
      throw new Error(`Error al desactivar imágenes principales: ${error.message}`);
    }
  }

  /**
   * Reordenar imágenes de un producto
   */
  static async reordenarImagenes(id_producto, ordenImagenes) {
    try {
      // ordenImagenes debe ser un array de objetos {id_imagen, orden}
      for (const item of ordenImagenes) {
        await this.actualizar(item.id_imagen, { orden: item.orden });
      }
      
      return await this.obtenerPorProducto(id_producto);
    } catch (error) {
      throw new Error(`Error al reordenar imágenes: ${error.message}`);
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_imagen: this.id_imagen,
      id_producto: this.id_producto,
      url_imagen: this.url_imagen,
      alt_text: this.alt_text,
      orden: this.orden,
      es_principal: this.es_principal,
      fecha_creacion: this.fecha_creacion,
      producto: this.producto
    };
  }
}

module.exports = ImagenProducto;