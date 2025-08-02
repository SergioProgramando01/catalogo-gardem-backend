const { executeQuery } = require('../../../database/connection');

class Talla {
  constructor(data = {}) {
    this.id_talla = data.id_talla;
    this.nombre = data.nombre;
  }

  /**
   * Crear una nueva talla
   */
  static async crear(tallaData) {
    try {
      const sql = `
        INSERT INTO Tallas (nombre)
        VALUES (?)
      `;
      
      const params = [tallaData.nombre];

      const result = await executeQuery(sql, params);
      return new Talla({ id_talla: result.insertId, ...tallaData });
    } catch (error) {
      throw new Error(`Error al crear talla: ${error.message}`);
    }
  }

  /**
   * Buscar talla por ID
   */
  static async buscarPorId(id_talla) {
    try {
      const sql = 'SELECT * FROM Tallas WHERE id_talla = ?';
      const tallas = await executeQuery(sql, [id_talla]);
      return tallas.length > 0 ? new Talla(tallas[0]) : null;
    } catch (error) {
      throw new Error(`Error al buscar talla por ID: ${error.message}`);
    }
  }

  /**
   * Buscar talla por nombre
   */
  static async buscarPorNombre(nombre) {
    try {
      const sql = 'SELECT * FROM Tallas WHERE nombre = ?';
      const tallas = await executeQuery(sql, [nombre]);
      return tallas.length > 0 ? new Talla(tallas[0]) : null;
    } catch (error) {
      throw new Error(`Error al buscar talla por nombre: ${error.message}`);
    }
  }

  /**
   * Obtener todas las tallas
   */
  static async obtenerTodas() {
    try {
      const sql = 'SELECT * FROM Tallas ORDER BY nombre ASC';
      const tallas = await executeQuery(sql);
      return tallas.map(talla => new Talla(talla));
    } catch (error) {
      throw new Error(`Error al obtener tallas: ${error.message}`);
    }
  }

  /**
   * Actualizar talla
   */
  static async actualizar(id_talla, datosActualizados) {
    try {
      let sql = 'UPDATE Tallas SET ';
      const params = [];
      const campos = [];

      // Construir la consulta dinámicamente
      if (datosActualizados.nombre !== undefined) {
        campos.push('nombre = ?');
        params.push(datosActualizados.nombre);
      }

      if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      sql += campos.join(', ') + ' WHERE id_talla = ?';
      params.push(id_talla);

      await executeQuery(sql, params);
      return await this.buscarPorId(id_talla);
    } catch (error) {
      throw new Error(`Error al actualizar talla: ${error.message}`);
    }
  }

  /**
   * Eliminar talla
   */
  static async eliminar(id_talla) {
    try {
      // Verificar si la talla está siendo usada en variantes de producto
      const sqlCheck = `
        SELECT COUNT(*) as count 
        FROM VariantesProducto 
        WHERE id_talla = ?
      `;
      const result = await executeQuery(sqlCheck, [id_talla]);
      
      if (result[0].count > 0) {
        throw new Error('No se puede eliminar la talla porque está siendo utilizada en productos');
      }

      const sql = 'DELETE FROM Tallas WHERE id_talla = ?';
      await executeQuery(sql, [id_talla]);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar talla: ${error.message}`);
    }
  }

  /**
   * Obtener tallas con conteo de productos
   */
  static async obtenerConConteoProductos() {
    try {
      const sql = `
        SELECT 
          t.*,
          COUNT(DISTINCT vp.id_producto) as total_productos
        FROM Tallas t
        LEFT JOIN VariantesProducto vp ON t.id_talla = vp.id_talla
        GROUP BY t.id_talla
        ORDER BY t.nombre ASC
      `;
      
      const tallas = await executeQuery(sql);
      return tallas.map(talla => {
        const tallaObj = new Talla(talla);
        tallaObj.total_productos = parseInt(talla.total_productos);
        return tallaObj;
      });
    } catch (error) {
      throw new Error(`Error al obtener tallas con conteo: ${error.message}`);
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_talla: this.id_talla,
      nombre: this.nombre
    };
  }
}

module.exports = Talla;