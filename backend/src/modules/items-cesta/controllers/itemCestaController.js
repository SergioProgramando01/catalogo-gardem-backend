const ItemCesta = require('../models/ItemCesta');
const CestaPedido = require('../../cesta-pedido/models/CestaPedido');
const VarianteProducto = require('../../variantes-producto/models/VarianteProducto');

class ItemCestaController {
  /**
   * Obtener todos los items de una cesta
   */
  async obtenerPorCesta(req, res) {
    try {
      const { cestaId } = req.params;

      // Verificar que la cesta existe
      const cesta = await CestaPedido.buscarPorId(cestaId);
      if (!cesta) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      // Verificar que el usuario puede acceder a esta cesta
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para acceder a esta cesta'
        });
      }

      const items = await ItemCesta.obtenerPorCesta(cestaId);

      res.json({
        items: items.map(item => item.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener items de la cesta',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener item por ID
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const item = await ItemCesta.buscarPorId(id);

      if (!item) {
        return res.status(404).json({
          error: 'Item no encontrado'
        });
      }

      // Verificar que el usuario puede acceder a este item
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== item.cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para acceder a este item'
        });
      }

      res.json({
        item: item.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener item',
        mensaje: error.message
      });
    }
  }

  /**
   * Agregar item a la cesta
   */
  async agregar(req, res) {
    try {
      const { cestaId } = req.params;
      const { id_variante, cantidad } = req.body;

      // Validaciones básicas
      if (!id_variante || !cantidad) {
        return res.status(400).json({
          error: 'La variante y cantidad son requeridas'
        });
      }

      if (cantidad <= 0 || !Number.isInteger(cantidad)) {
        return res.status(400).json({
          error: 'La cantidad debe ser un número entero mayor a 0'
        });
      }

      // Verificar que la cesta existe
      const cesta = await CestaPedido.buscarPorId(cestaId);
      if (!cesta) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      // Verificar que el usuario puede modificar esta cesta
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para modificar esta cesta'
        });
      }

      // Verificar que la variante existe
      const variante = await VarianteProducto.buscarPorId(id_variante);
      if (!variante) {
        return res.status(400).json({
          error: 'Variante no encontrada'
        });
      }

      const item = await ItemCesta.agregar(cestaId, id_variante, cantidad);

      res.status(201).json({
        item: item.toPublicObject(),
        mensaje: 'Item agregado a la cesta exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al agregar item a la cesta',
        mensaje: error.message
      });
    }
  }

  /**
   * Actualizar cantidad de item
   */
  async actualizarCantidad(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;

      // Validaciones
      if (!cantidad || cantidad <= 0 || !Number.isInteger(cantidad)) {
        return res.status(400).json({
          error: 'La cantidad debe ser un número entero mayor a 0'
        });
      }

      // Verificar que el item existe
      const item = await ItemCesta.buscarPorId(id);
      if (!item) {
        return res.status(404).json({
          error: 'Item no encontrado'
        });
      }

      // Verificar que el usuario puede modificar este item
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== item.cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para modificar este item'
        });
      }

      const itemActualizado = await ItemCesta.actualizarCantidad(id, cantidad);

      res.json({
        item: itemActualizado.toPublicObject(),
        mensaje: 'Cantidad actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al actualizar cantidad',
        mensaje: error.message
      });
    }
  }

  /**
   * Eliminar item de la cesta
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      // Verificar que el item existe
      const item = await ItemCesta.buscarPorId(id);
      if (!item) {
        return res.status(404).json({
          error: 'Item no encontrado'
        });
      }

      // Verificar que el usuario puede eliminar este item
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== item.cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para eliminar este item'
        });
      }

      await ItemCesta.eliminar(id);

      res.json({
        mensaje: 'Item eliminado de la cesta exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al eliminar item',
        mensaje: error.message
      });
    }
  }

  /**
   * Verificar stock de item
   */
  async verificarStock(req, res) {
    try {
      const { id } = req.params;

      // Verificar que el item existe
      const item = await ItemCesta.buscarPorId(id);
      if (!item) {
        return res.status(404).json({
          error: 'Item no encontrado'
        });
      }

      // Verificar que el usuario puede acceder a este item
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== item.cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para acceder a este item'
        });
      }

      const stockInfo = await ItemCesta.verificarStock(id);

      res.json({
        stock_info: stockInfo
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al verificar stock',
        mensaje: error.message
      });
    }
  }

  /**
   * Agregar múltiples items a la cesta
   */
  async agregarMultiples(req, res) {
    try {
      const { cestaId } = req.params;
      const { items } = req.body;

      // Validaciones
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          error: 'Debe proporcionar al menos un item'
        });
      }

      // Verificar que la cesta existe
      const cesta = await CestaPedido.buscarPorId(cestaId);
      if (!cesta) {
        return res.status(404).json({
          error: 'Cesta no encontrada'
        });
      }

      // Verificar que el usuario puede modificar esta cesta
      if (req.usuario.rol !== 'Administrador' && req.usuario.id_usuario !== cesta.id_usuario) {
        return res.status(403).json({
          error: 'No tienes permisos para modificar esta cesta'
        });
      }

      const itemsAgregados = [];
      const errores = [];

      // Procesar cada item
      for (const itemData of items) {
        try {
          const { id_variante, cantidad } = itemData;

          if (!id_variante || !cantidad) {
            errores.push(`Item inválido: variante y cantidad son requeridas`);
            continue;
          }

          if (cantidad <= 0 || !Number.isInteger(cantidad)) {
            errores.push(`Cantidad inválida para variante ${id_variante}: debe ser un número entero mayor a 0`);
            continue;
          }

          const item = await ItemCesta.agregar(cestaId, id_variante, cantidad);
          itemsAgregados.push(item.toPublicObject());
        } catch (error) {
          errores.push(`Error al agregar variante ${itemData.id_variante}: ${error.message}`);
        }
      }

      res.status(201).json({
        items_agregados: itemsAgregados,
        total_agregados: itemsAgregados.length,
        errores: errores,
        mensaje: `${itemsAgregados.length} items agregados exitosamente${errores.length > 0 ? `, ${errores.length} errores` : ''}`
      });
    } catch (error) {
      res.status(400).json({
        error: 'Error al agregar múltiples items',
        mensaje: error.message
      });
    }
  }

  /**
   * Obtener todos los items de cesta (admin)
   */
  async obtenerTodos(req, res) {
    try {
      const items = await ItemCesta.obtenerTodos();

      res.json({
        mensaje: 'Items de cesta obtenidos exitosamente',
        items: items.map(item => item.toPublicObject()),
        total: items.length
      });
    } catch (error) {
      console.error('Error al obtener items de cesta:', error);
      res.status(500).json({
        error: 'Error al obtener items de cesta',
        mensaje: error.message
      });
    }
  }
}

module.exports = new ItemCestaController(); 