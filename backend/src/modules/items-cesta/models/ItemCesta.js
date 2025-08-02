const { executeQuery } = require('../../../database/connection');

class ItemCesta {
  constructor(data = {}) {
    this.id_item_cesta = data.id_item_cesta;
    this.id_cesta = data.id_cesta;
    this.id_variante = data.id_variante;
    this.cantidad = data.cantidad;
    this.fecha_creacion = data.fecha_creacion;
    
    // Para joins
    this.cesta = data.cesta;
    this.variante = data.variante;
    this.producto = data.producto;
    this.talla = data.talla;
    this.color = data.color;
    this.precio_unitario = data.precio_unitario;
    this.subtotal = data.subtotal;
  }

  /**
   * Agregar item a la cesta
   */
  static async agregar(id_cesta, id_variante, cantidad) {
    try {
      // Verificar que la variante existe y tiene stock
      const sqlCheckVariante = `
        SELECT vp.*, p.nombre as producto_nombre, p.precio as producto_precio
        FROM VariantesProducto vp
        LEFT JOIN Productos p ON vp.id_producto = p.id_producto
        WHERE vp.id_variante = ?
      `;
      const variantes = await executeQuery(sqlCheckVariante, [id_variante]);
      
      if (variantes.length === 0) {
        throw new Error('Variante no encontrada');
      }

      const variante = variantes[0];
      if (variante.stock < cantidad) {
        throw new Error(`Stock insuficiente. Disponible: ${variante.stock}`);
      }

      // Verificar si ya existe el item en la cesta
      const sqlCheckItem = `
        SELECT * FROM ItemsCesta 
        WHERE id_cesta = ? AND id_variante = ?
      `;
      const itemsExistentes = await executeQuery(sqlCheckItem, [id_cesta, id_variante]);

      if (itemsExistentes.length > 0) {
        // Actualizar cantidad existente
        const nuevaCantidad = itemsExistentes[0].cantidad + cantidad;
        if (variante.stock < nuevaCantidad) {
          throw new Error(`Stock insuficiente para la cantidad total. Disponible: ${variante.stock}`);
        }

        const sqlUpdate = `
          UPDATE ItemsCesta 
          SET cantidad = ? 
          WHERE id_item_cesta = ?
        `;
        await executeQuery(sqlUpdate, [nuevaCantidad, itemsExistentes[0].id_item_cesta]);
        
        return await this.buscarPorId(itemsExistentes[0].id_item_cesta);
      } else {
        // Crear nuevo item
        const sql = `
          INSERT INTO ItemsCesta (id_cesta, id_variante, cantidad)
          VALUES (?, ?, ?)
        `;
        
        const result = await executeQuery(sql, [id_cesta, id_variante, cantidad]);
        return await this.buscarPorId(result.insertId);
      }
    } catch (error) {
      throw new Error(`Error al agregar item a la cesta: ${error.message}`);
    }
  }

  /**
   * Buscar item por ID
   */
  static async buscarPorId(id_item_cesta) {
    try {
      const sql = `
        SELECT ic.*, 
               c.id_usuario,
               vp.stock, vp.precio_adicional,
               p.nombre as producto_nombre, p.precio as producto_precio,
               t.nombre as talla_nombre,
               c2.nombre as color_nombre, c2.codigo_hex as color_codigo
        FROM ItemsCesta ic
        LEFT JOIN CestaPedido c ON ic.id_cesta = c.id_cesta
        LEFT JOIN VariantesProducto vp ON ic.id_variante = vp.id_variante
        LEFT JOIN Productos p ON vp.id_producto = p.id_producto
        LEFT JOIN Tallas t ON vp.id_talla = t.id_talla
        LEFT JOIN Colores c2 ON vp.id_color = c2.id_color
        WHERE ic.id_item_cesta = ?
      `;
      const items = await executeQuery(sql, [id_item_cesta]);
      
      if (items.length > 0) {
        const item = items[0];
        const precio_unitario = item.producto_precio + item.precio_adicional;
        const subtotal = precio_unitario * item.cantidad;

        return new ItemCesta({
          ...item,
          precio_unitario,
          subtotal,
          cesta: {
            id_cesta: item.id_cesta,
            id_usuario: item.id_usuario
          },
          variante: {
            id_variante: item.id_variante,
            stock: item.stock,
            precio_adicional: item.precio_adicional
          },
          producto: {
            id_producto: item.id_producto,
            nombre: item.producto_nombre,
            precio: item.producto_precio
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
        });
      }
      return null;
    } catch (error) {
      throw new Error(`Error al buscar item por ID: ${error.message}`);
    }
  }

  /**
   * Obtener items por cesta
   */
  static async obtenerPorCesta(id_cesta) {
    try {
      const sql = `
        SELECT ic.*, 
               c.id_usuario,
               vp.stock, vp.precio_adicional,
               p.nombre as producto_nombre, p.precio as producto_precio,
               t.nombre as talla_nombre,
               c2.nombre as color_nombre, c2.codigo_hex as color_codigo
        FROM ItemsCesta ic
        LEFT JOIN CestaPedido c ON ic.id_cesta = c.id_cesta
        LEFT JOIN VariantesProducto vp ON ic.id_variante = vp.id_variante
        LEFT JOIN Productos p ON vp.id_producto = p.id_producto
        LEFT JOIN Tallas t ON vp.id_talla = t.id_talla
        LEFT JOIN Colores c2 ON vp.id_color = c2.id_color
        WHERE ic.id_cesta = ?
        ORDER BY ic.fecha_creacion ASC
      `;
      const items = await executeQuery(sql, [id_cesta]);
      
      return items.map(item => {
        const precio_unitario = item.producto_precio + item.precio_adicional;
        const subtotal = precio_unitario * item.cantidad;

        return new ItemCesta({
          ...item,
          precio_unitario,
          subtotal,
          cesta: {
            id_cesta: item.id_cesta,
            id_usuario: item.id_usuario
          },
          variante: {
            id_variante: item.id_variante,
            stock: item.stock,
            precio_adicional: item.precio_adicional
          },
          producto: {
            id_producto: item.id_producto,
            nombre: item.producto_nombre,
            precio: item.producto_precio
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
        });
      });
    } catch (error) {
      throw new Error(`Error al obtener items por cesta: ${error.message}`);
    }
  }

  /**
   * Actualizar cantidad de item
   */
  static async actualizarCantidad(id_item_cesta, nuevaCantidad) {
    try {
      // Verificar que el item existe
      const item = await this.buscarPorId(id_item_cesta);
      if (!item) {
        throw new Error('Item no encontrado');
      }

      // Verificar stock disponible
      if (item.variante.stock < nuevaCantidad) {
        throw new Error(`Stock insuficiente. Disponible: ${item.variante.stock}`);
      }

      // Validar cantidad
      if (nuevaCantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      const sql = 'UPDATE ItemsCesta SET cantidad = ? WHERE id_item_cesta = ?';
      const result = await executeQuery(sql, [nuevaCantidad, id_item_cesta]);
      
      if (result.affectedRows === 0) {
        throw new Error('Item no encontrado');
      }

      return await this.buscarPorId(id_item_cesta);
    } catch (error) {
      throw new Error(`Error al actualizar cantidad: ${error.message}`);
    }
  }

  /**
   * Eliminar item de la cesta
   */
  static async eliminar(id_item_cesta) {
    try {
      const sql = 'DELETE FROM ItemsCesta WHERE id_item_cesta = ?';
      const result = await executeQuery(sql, [id_item_cesta]);
      
      if (result.affectedRows === 0) {
        throw new Error('Item no encontrado');
      }

      return true;
    } catch (error) {
      throw new Error(`Error al eliminar item: ${error.message}`);
    }
  }

  /**
   * Verificar disponibilidad de stock
   */
  static async verificarStock(id_item_cesta) {
    try {
      const item = await this.buscarPorId(id_item_cesta);
      if (!item) {
        throw new Error('Item no encontrado');
      }

      return {
        disponible: item.variante.stock >= item.cantidad,
        stock_disponible: item.variante.stock,
        cantidad_solicitada: item.cantidad,
        diferencia: item.variante.stock - item.cantidad
      };
    } catch (error) {
      throw new Error(`Error al verificar stock: ${error.message}`);
    }
  }

  /**
   * Obtener todos los items de cesta
   */
  static async obtenerTodos() {
    try {
      const resultados = await executeQuery(
        `SELECT ic.*, 
                c.id_usuario as cesta_usuario,
                vp.id_producto,
                p.nombre as nombre_producto,
                t.nombre as talla,
                col.nombre as color,
                col.codigo_hex
         FROM ItemsCesta ic
         LEFT JOIN CestaPedido c ON ic.id_cesta = c.id_cesta
         LEFT JOIN VariantesProducto vp ON ic.id_variante = vp.id_variante
         LEFT JOIN Productos p ON vp.id_producto = p.id_producto
         LEFT JOIN Tallas t ON vp.id_talla = t.id_talla
         LEFT JOIN Colores col ON vp.id_color = col.id_color
         ORDER BY ic.id_item_cesta DESC`
      );

      return resultados.map(row => new ItemCesta({
        ...row,
        cesta: {
          id_cesta: row.id_cesta,
          id_usuario: row.cesta_usuario
        },
        variante: {
          id_variante: row.id_variante,
          id_producto: row.id_producto,
          nombre_producto: row.nombre_producto,
          talla: row.talla,
          color: row.color,
          codigo_hex: row.codigo_hex
        }
      }));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Convertir a objeto público
   */
  toPublicObject() {
    return {
      id_item_cesta: this.id_item_cesta,
      id_cesta: this.id_cesta,
      id_variante: this.id_variante,
      cantidad: this.cantidad,
      fecha_creacion: this.fecha_creacion,
      precio_unitario: this.precio_unitario,
      subtotal: this.subtotal,
      cesta: this.cesta,
      variante: this.variante,
      producto: this.producto,
      talla: this.talla,
      color: this.color
    };
  }
}

module.exports = ItemCesta; 