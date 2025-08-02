const Usuario = require('../models/Usuario');
const authService = require('../services/authService');

class UsuarioController {
  /**
   * Registrar nuevo usuario
   */
  async registrar(req, res) {
    try {
      const { nombre_usuario, email, contraseña, rol } = req.body;

      // Validaciones básicas
      if (!nombre_usuario || !email || !contraseña) {
        return res.status(400).json({
          error: 'Nombre de usuario, email y contraseña son requeridos'
        });
      }

      if (contraseña.length < 6) {
        return res.status(400).json({
          error: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      const resultado = await authService.registrar({
        nombre_usuario,
        email,
        contraseña,
        rol: rol || 'Cliente'
      });

      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }

  /**
   * Iniciar sesión
   */
  async login(req, res) {
    try {
      const { email, contraseña } = req.body;

      if (!email || !contraseña) {
        return res.status(400).json({
          error: 'Email y contraseña son requeridos'
        });
      }

      const resultado = await authService.login(email, contraseña);
      res.json(resultado);
    } catch (error) {
      res.status(401).json({
        error: error.message
      });
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  async obtenerPerfil(req, res) {
    try {
      res.json({
        usuario: req.usuario
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener perfil'
      });
    }
  }

  /**
   * Obtener todos los usuarios (solo administradores)
   */
  async obtenerTodos(req, res) {
    try {
      const usuarios = await Usuario.obtenerTodos();
      res.json({
        usuarios: usuarios.map(usuario => usuario.toPublicObject())
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener usuarios'
      });
    }
  }

  /**
   * Obtener usuario por ID (solo administradores)
   */
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.buscarPorId(id);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        usuario: usuario.toPublicObject()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener usuario'
      });
    }
  }

  /**
   * Actualizar usuario
   */
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Solo permitir actualizar ciertos campos
      const camposPermitidos = ['nombre_usuario', 'email', 'rol'];
      const datosFiltrados = {};

      camposPermitidos.forEach(campo => {
        if (datosActualizados[campo] !== undefined) {
          datosFiltrados[campo] = datosActualizados[campo];
        }
      });

      if (Object.keys(datosFiltrados).length === 0) {
        return res.status(400).json({
          error: 'No hay campos válidos para actualizar'
        });
      }

      const usuarioActualizado = await Usuario.actualizar(id, datosFiltrados);
      res.json({
        usuario: usuarioActualizado.toPublicObject(),
        mensaje: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }

  /**
   * Cambiar contraseña
   */
  async cambiarContraseña(req, res) {
    try {
      const { contraseñaActual, nuevaContraseña } = req.body;
      const id_usuario = req.usuario.id_usuario;

      if (!contraseñaActual || !nuevaContraseña) {
        return res.status(400).json({
          error: 'Contraseña actual y nueva contraseña son requeridas'
        });
      }

      if (nuevaContraseña.length < 6) {
        return res.status(400).json({
          error: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      const resultado = await authService.cambiarContraseña(
        id_usuario,
        contraseñaActual,
        nuevaContraseña
      );

      res.json(resultado);
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }

  /**
   * Eliminar usuario (solo administradores)
   */
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      
      // No permitir eliminar el propio usuario
      if (parseInt(id) === req.usuario.id_usuario) {
        return res.status(400).json({
          error: 'No puedes eliminar tu propia cuenta'
        });
      }

      await Usuario.eliminar(id);
      res.json({
        mensaje: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al eliminar usuario'
      });
    }
  }

  /**
   * Verificar token
   */
  async verificarToken(req, res) {
    try {
      res.json({
        valido: true,
        usuario: req.usuario
      });
    } catch (error) {
      res.status(401).json({
        valido: false,
        error: 'Token inválido'
      });
    }
  }
}

module.exports = new UsuarioController(); 