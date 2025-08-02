const { executeQuery } = require('../../../database/connection');

class CestaPedido {
  constructor(data = {}) {
    this.id_cesta = data.id_cesta;
    this.id_usuario = data.id_usuario;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
    this.estado = data.estado || 'activa';
    
    // Para joins
    this.usuario = data.usuario;
    this.items = data.items || [];
    this.total_items = data.total_items || 0;
    this.total_precio = data.total_precio || 0;
  }

  /**
   * Crear una nueva cesta de pedido
   */
  static async crear(id_usuario) {
    try {
      // Verificar si el usuario ya tiene una cesta activa
      const cestaExistente = await this.obtenerPorUsuario(id_usuario);
      if (cestaExistente) {
        return cestaExistente;
      }

      const sql = `
        INSERT INTO CestaPedido (id_usuario, estado)
        VALUES (?, 'activa')
      `;
      
      const result = await executeQuery(sql, [id_usuario]);
      return await this.buscarPorId(result.insertId);
    } catch (error) {
      throw new Error(`Error al crear cesta de pedido: ${error.message}`);
    }
  }

  /**
   * Buscar cesta por ID
   */
  static async buscarPorId(id_cesta) {
    try {
      const sql = `
        SELECT c.*, u.nombre_usuario, u.email
        FROM CestaPedido c
        LEFT JOIN Usuarios u ON c.id_usuario = u.id_usuario
        WHERE c.id_cesta = ?
      `;
      const cestas = await executeQuery(sql, [id_cesta]);
      
      if (cestas.length > 0) {
        const cesta = cestas[0];
        const cestaObj = new CestaPedido({
          ...cesta,
          usuario: {
            id_usuario: cesta.id_usuario,
            nombre_usuario: cesta.nombre_usuario,
            email: cesta.email
          }
        });

        // Obtener items de la cesta
        const items = await this.obtenerItemsCesta(id_cesta);
        cestaObj.items = items;
        cestaObj.total_items = items.length;
        cestaObj.total_precio = items.reduce((total, item) => total + item.subtotal, 0);

        return cestaObj;
      }
      return null;
    } catch (error) {
      throw new Error(`Error al buscar cesta por ID: ${error.message}`);
    }
  }

  /**
   * Obtener cesta por usuario
   */
  static async obtenerPorUsuario(id_usuario) {
    try {
      const sql = `
        SELECT c.*, u.nombre_usuario, u.email
        FROM CestaPedido c
        LEFT JOIN Usuarios u ON c.id_usuario = u.id_usuario
        WHERE c.id_usuario = ? AND c.estado = 'activa'
        ORDER BY c.fecha_creacion DESC
        LIMIT 1
      `;
      const cestas = await executeQuery(sql, [id_usuario]);
      
      if (cestas.length > 0) {
        const cesta = cestas[0];
        const cestaObj = new CestaPedido({
          ...cesta,
          usuario: {
            id_usuario: cesta.id_usuario,
            nombre_usuario: cesta.nombre_usuario,
            email: cesta.email
          }
        });

        // Obtener items de la cesta
        const items = await this.obtenerItemsCesta(cesta.id_cesta);
        cestaObj.items = items;
        cestaObj.total_items = items.length;
        cestaObj.total_precio = items.reduce((total, item) => total + item.subtotal, 0);

        return cestaObj;
      }
      return null;
    } catch (error) {
      throw new Error(`Error al obtener cesta por usuario: ${error.message}`);
    }
  }

  /**
   * Obtener todas las cestas
   */
  static async obtenerTodas() {
    try {
      const sql = `
        SELECT c.*, u.nombre_usuario, u.email
        FROM CestaPedido c
        LEFT JOIN Usuarios u ON c.id_usuario = u.id_usuario
        ORDER BY c.fecha_creacion DESC
      `;
      const cestas = await executeQuery(sql);
      
      const cestasConItems = await Promise.all(
        cestas.map(async (cesta) => {
          const cestaObj = new CestaPedido({
            ...cesta,
            usuario: {
              id_usuario: cesta.id_usuario,
              nombre_usuario: cesta.nombre_usuario,
              email: cesta.email
            }
          });

          // Obtener items de la cesta
          const items = await this.obtenerItemsCesta(cesta.id_cesta);
          cestaObj.items = items;
          cestaObj.total_items = items.length;
          cestaObj.total_precio = items.reduce((total, item) => total + item.subtotal, 0);

          return cestaObj;
        })
      );

      return cestasConItems;
    } catch (error) {
      throw new Error(`Error al obtener cestas: ${error.message}`);
    }
  }

  /**
   * Actualizar cesta
   */
  static async actualizar(id_cesta, datosActualizados) {
    try {
      let sql = 'UPDATE CestaPedido SET ';
      const params = [];
      const campos = [];

      // Construir la consulta dinámicamente
      if (datosActualizados.estado !== undefined) {
        campos.push('estado = ?');
        params.push(datosActualizados.estado);
      }

      if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      campos.push('fecha_actualizacion = CURRENT_TIMESTAMP');
      sql += campos.join(', ') + ' WHERE id_cesta = ?';
      params.push(id_cesta);

      const result = await executeQuery(sql, params);
      
      if (result.affectedRows === 0) {
        throw new Error('Cesta no encontrada');
      }

      return await this.buscarPorId(id_cesta);
    } catch (error) {
      throw new Error(`Error al actualizar cesta: ${error.message}`);
    }
  }

  /**
   * Eliminar cesta
   */
  static async eliminar(id_cesta) {
    try {
      // Primero eliminar todos los items de la cesta
      const sqlDeleteItems = 'DELETE FROM ItemsCesta WHERE id_cesta = ?';
      await executeQuery(sqlDeleteItems, [id_cesta]);

      // Luego eliminar la cesta
      const sql = 'DELETE FROM CestaPedido WHERE id_cesta = ?';
      const result = await executeQuery(sql, [id_cesta]);
      
      if (result.affectedRows === 0) {
        throw new Error('Cesta no encontrada');
      }

      return true;
    } catch (error) {
      throw new Error(`Error al eliminar cesta: ${error.message}`);
    }
  }

  /**
   * Vaciar cesta (eliminar todos los items)
   */
  static async vaciar(id_cesta) {
    try {
      const sql = 'DELETE FROM ItemsCesta WHERE id_cesta = ?';
      const result = await executeQuery(sql, [id_cesta]);
      
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error al vaciar cesta: ${error.message}`);
    }
  }

  /**
   * Finalizar cesta (cambiar estado a 'finalizada')
   */
  static async finalizar(id_cesta) {
    try {
      return await this.actualizar(id_cesta, { estado: 'finalizada' });
    } catch (error) {
      throw new Error(`Error al finalizar cesta: ${error.message}`);
    }
  }

  /**
   * Obtener items de una cesta
   */
  static async obtenerItemsCesta(id_cesta) {
    try {
      const sql = `
        SELECT ic.*, 
               vp.stock, vp.precio_adicional,
               p.nombre as producto_nombre, p.precio as producto_precio,
               t.nombre as talla_nombre,
               c.nombre as color_nombre, c.codigo_hex as color_codigo
        FROM ItemsCesta ic
        LEFT JOIN VariantesProducto vp ON ic.id_variante = vp.id_variante
        LEFT JOIN Productos p ON vp.id_producto = p.id_producto
        LEFT JOIN Tallas t ON vp.id_talla = t.id_talla
        LEFT JOIN Colores c ON vp.id_color = c.id_color
        WHERE ic.id_cesta = ?
        ORDER BY ic.fecha_creacion ASC
      `;
      const items = await executeQuery(sql, [id_cesta]);
      
      return items.map(item => ({
        ...item,
        precio_unitario: item.producto_precio + item.precio_adicional,
        subtotal: (item.producto_precio + item.precio_adicional) * item.cantidad,
        producto: {
          id_producto: item.id_producto,
          nombre: item.producto_nombre,
          precio: item.producto_precio
        },
        variante: {
          id_variante: item.id_variante,
          stock: item.stock,
          precio_adicional: item.precio_adicional
        },
        talla: {
          id_talla: item.id_talla,
          nombre: item.talla_nombre
        },
        color: {
          id_color: item.id_color,
          nombre: item.color_nombre,
          codigo_hex: item.color_codigo
        }
      }));
    } catch (error) {
      throw new Error(`Error al obtener items de cesta: ${error.message}`);
    }
  }

  /**
   * Calcular total de la cesta
   */
  static async calcularTotal(id_cesta) {
    try {
      const items = await this.obtenerItemsCesta(id_cesta);
      const total = items.reduce((sum, item) => sum + item.subtotal, 0);
      const total_items = items.reduce((sum, item) => sum + item.cantidad, 0);
      
      return {
        total_items,
        total_precio: total,
        items_count: items.length
      };
    } catch (error) {
      throw new Error(`Error al calcular total: ${error.message}`);
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_cesta: this.id_cesta,
      id_usuario: this.id_usuario,
      fecha_creacion: this.fecha_creacion,
      fecha_actualizacion: this.fecha_actualizacion,
      estado: this.estado,
      usuario: this.usuario,
      items: this.items,
      total_items: this.total_items,
      total_precio: this.total_precio
    };
  }
}

module.exports = CestaPedido; 