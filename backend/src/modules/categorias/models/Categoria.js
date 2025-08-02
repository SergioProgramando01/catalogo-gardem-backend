const { executeQuery } = require('../../../database/connection');

class Categoria {
  constructor(data = {}) {
    this.id_categoria = data.id_categoria;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.activa = data.activa !== undefined ? data.activa : true;
    this.fecha_creacion = data.fecha_creacion;
  }

  /**
   * Crear una nueva categoría
   */
  static async crear(categoriaData) {
    try {
      const sql = `
        INSERT INTO Categorias (nombre, descripcion)
        VALUES (?, ?)
      `;
      
      const params = [
        categoriaData.nombre,
        categoriaData.descripcion || null
      ];

      const result = await executeQuery(sql, params);
      return new Categoria({ id_categoria: result.insertId, ...categoriaData });
    } catch (error) {
      throw new Error(`Error al crear categoría: ${error.message}`);
    }
  }

  /**
   * Buscar categoría por ID
   */
  static async buscarPorId(id_categoria) {
    try {
      const sql = 'SELECT * FROM Categorias WHERE id_categoria = ?';
      const categorias = await executeQuery(sql, [id_categoria]);
      return categorias.length > 0 ? new Categoria(categorias[0]) : null;
    } catch (error) {
      throw new Error(`Error al buscar categoría por ID: ${error.message}`);
    }
  }

  /**
   * Buscar categoría por nombre
   */
  static async buscarPorNombre(nombre) {
    try {
      const sql = 'SELECT * FROM Categorias WHERE nombre = ?';
      const categorias = await executeQuery(sql, [nombre]);
      return categorias.length > 0 ? new Categoria(categorias[0]) : null;
    } catch (error) {
      throw new Error(`Error al buscar categoría por nombre: ${error.message}`);
    }
  }

  /**
   * Obtener todas las categorías
   */
  static async obtenerTodas(activas = null) {
    try {
      let sql = 'SELECT * FROM Categorias';
      const params = [];

      // Por ahora, como no tenemos el campo activa, retornamos todas
      // TODO: Implementar cuando se agregue el campo activa a la base de datos
      sql += ' ORDER BY nombre ASC';
      const categorias = await executeQuery(sql, params);
      return categorias.map(categoria => new Categoria(categoria));
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }

  /**
   * Actualizar categoría
   */
  static async actualizar(id_categoria, datosActualizados) {
    try {
      let sql = 'UPDATE Categorias SET ';
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
      // TODO: Implementar actualización de activa cuando se agregue el campo

      if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      sql += campos.join(', ') + ' WHERE id_categoria = ?';
      params.push(id_categoria);

      await executeQuery(sql, params);
      return await this.buscarPorId(id_categoria);
    } catch (error) {
      throw new Error(`Error al actualizar categoría: ${error.message}`);
    }
  }

  /**
   * Eliminar categoría (soft delete - marcar como inactiva)
   */
  static async eliminar(id_categoria) {
    try {
      // Por ahora, como no tenemos el campo activa, hacemos eliminación permanente
      // TODO: Implementar soft delete cuando se agregue el campo activa
      const sql = 'DELETE FROM Categorias WHERE id_categoria = ?';
      await executeQuery(sql, [id_categoria]);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar categoría: ${error.message}`);
    }
  }

  /**
   * Eliminar categoría permanentemente
   */
  static async eliminarPermanente(id_categoria) {
    try {
      const sql = 'DELETE FROM Categorias WHERE id_categoria = ?';
      await executeQuery(sql, [id_categoria]);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar categoría permanentemente: ${error.message}`);
    }
  }

  /**
   * Activar categoría
   */
  static async activar(id_categoria) {
    try {
      // Por ahora, como no tenemos el campo activa, solo retornamos la categoría
      // TODO: Implementar cuando se agregue el campo activa
      return await this.buscarPorId(id_categoria);
    } catch (error) {
      throw new Error(`Error al activar categoría: ${error.message}`);
    }
  }

  /**
   * Obtener categorías con conteo de productos
   */
  static async obtenerConConteoProductos() {
    try {
      const sql = `
        SELECT 
          c.*,
          COUNT(p.id_producto) as total_productos
        FROM Categorias c
        LEFT JOIN Productos p ON c.id_categoria = p.id_categoria
        GROUP BY c.id_categoria
        ORDER BY c.nombre ASC
      `;
      
      const categorias = await executeQuery(sql);
      return categorias.map(categoria => ({
        ...new Categoria(categoria),
        total_productos: parseInt(categoria.total_productos)
      }));
    } catch (error) {
      throw new Error(`Error al obtener categorías con conteo: ${error.message}`);
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_categoria: this.id_categoria,
      nombre: this.nombre,
      descripcion: this.descripcion,
      activa: this.activa,
      fecha_creacion: this.fecha_creacion
    };
  }
}

module.exports = Categoria; 