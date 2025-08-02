const { executeQuery } = require('../../../database/connection');

class Color {
  constructor(data = {}) {
    this.id_color = data.id_color;
    this.nombre = data.nombre;
    this.codigo_hex = data.codigo_hex;
  }

  /**
   * Crear un nuevo color
   */
  static async crear(colorData) {
    try {
      const sql = `
        INSERT INTO Colores (nombre, codigo_hex)
        VALUES (?, ?)
      `;
      
      const params = [colorData.nombre, colorData.codigo_hex];

      const result = await executeQuery(sql, params);
      return new Color({ id_color: result.insertId, ...colorData });
    } catch (error) {
      throw new Error(`Error al crear color: ${error.message}`);
    }
  }

  /**
   * Buscar color por ID
   */
  static async buscarPorId(id_color) {
    try {
      const sql = 'SELECT * FROM Colores WHERE id_color = ?';
      const colores = await executeQuery(sql, [id_color]);
      return colores.length > 0 ? new Color(colores[0]) : null;
    } catch (error) {
      throw new Error(`Error al buscar color por ID: ${error.message}`);
    }
  }

  /**
   * Buscar color por nombre
   */
  static async buscarPorNombre(nombre) {
    try {
      const sql = 'SELECT * FROM Colores WHERE nombre = ?';
      const colores = await executeQuery(sql, [nombre]);
      return colores.length > 0 ? new Color(colores[0]) : null;
    } catch (error) {
      throw new Error(`Error al buscar color por nombre: ${error.message}`);
    }
  }

  /**
   * Obtener todos los colores
   */
  static async obtenerTodas() {
    try {
      const sql = 'SELECT * FROM Colores ORDER BY nombre ASC';
      const colores = await executeQuery(sql);
      return colores.map(color => new Color(color));
    } catch (error) {
      throw new Error(`Error al obtener colores: ${error.message}`);
    }
  }

  /**
   * Actualizar color
   */
  static async actualizar(id_color, datosActualizados) {
    try {
      let sql = 'UPDATE Colores SET ';
      const params = [];
      const campos = [];

      // Construir la consulta dinámicamente
      if (datosActualizados.nombre !== undefined) {
        campos.push('nombre = ?');
        params.push(datosActualizados.nombre);
      }

      if (datosActualizados.codigo_hex !== undefined) {
        campos.push('codigo_hex = ?');
        params.push(datosActualizados.codigo_hex);
      }

      if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      sql += campos.join(', ') + ' WHERE id_color = ?';
      params.push(id_color);

      await executeQuery(sql, params);
      return await this.buscarPorId(id_color);
    } catch (error) {
      throw new Error(`Error al actualizar color: ${error.message}`);
    }
  }

  /**
   * Eliminar color
   */
  static async eliminar(id_color) {
    try {
      // Verificar si el color está siendo usada en variantes de producto
      const sqlCheck = `
        SELECT COUNT(*) as count 
        FROM VariantesProducto 
        WHERE id_color = ?
      `;
      const result = await executeQuery(sqlCheck, [id_color]);
      
      if (result[0].count > 0) {
        throw new Error('No se puede eliminar el color porque está siendo utilizado en productos');
      }

      const sql = 'DELETE FROM Colores WHERE id_color = ?';
      await executeQuery(sql, [id_color]);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar color: ${error.message}`);
    }
  }

  /**
   * Obtener colores con conteo de productos
   */
  static async obtenerConConteoProductos() {
    try {
      const sql = `
        SELECT 
          c.*,
          COUNT(DISTINCT vp.id_producto) as total_productos
        FROM Colores c
        LEFT JOIN VariantesProducto vp ON c.id_color = vp.id_color
        GROUP BY c.id_color
        ORDER BY c.nombre ASC
      `;
      
      const colores = await executeQuery(sql);
      return colores.map(color => {
        const colorObj = new Color(color);
        colorObj.total_productos = parseInt(color.total_productos);
        return colorObj;
      });
    } catch (error) {
      throw new Error(`Error al obtener colores con conteo: ${error.message}`);
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_color: this.id_color,
      nombre: this.nombre,
      codigo_hex: this.codigo_hex
    };
  }
}

module.exports = Color;