const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'tu_clave_secreta_jwt_aqui_cambiar_en_produccion';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  /**
   * Generar token JWT
   */
  generarToken(usuario) {
    const payload = {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  /**
   * Verificar token JWT
   */
  verificarToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async registrar(datosUsuario) {
    try {
      // Verificar si el email ya existe
      const usuarioExistente = await Usuario.buscarPorEmail(datosUsuario.email);
      if (usuarioExistente) {
        throw new Error('El email ya está registrado');
      }

      // Crear el usuario
      const nuevoUsuario = await Usuario.crear(datosUsuario);
      
      // Generar token
      const token = this.generarToken(nuevoUsuario);

      return {
        usuario: nuevoUsuario.toPublicObject(),
        token,
        mensaje: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error en registro: ${error.message}`);
    }
  }

  /**
   * Iniciar sesión
   */
  async login(email, contraseña) {
    try {
      // Buscar usuario por email
      const usuario = await Usuario.buscarPorEmail(email);
      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const contraseñaValida = await usuario.verificarContraseña(contraseña);
      if (!contraseñaValida) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token
      const token = this.generarToken(usuario);

      return {
        usuario: usuario.toPublicObject(),
        token,
        mensaje: 'Inicio de sesión exitoso'
      };
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  /**
   * Obtener usuario actual desde token
   */
  async obtenerUsuarioActual(token) {
    try {
      const payload = this.verificarToken(token);
      const usuario = await Usuario.buscarPorId(payload.id_usuario);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return usuario.toPublicObject();
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Cambiar contraseña
   */
  async cambiarContraseña(id_usuario, contraseñaActual, nuevaContraseña) {
    try {
      const usuario = await Usuario.buscarPorId(id_usuario);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const contraseñaValida = await usuario.verificarContraseña(contraseñaActual);
      if (!contraseñaValida) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Actualizar contraseña
      await Usuario.actualizar(id_usuario, { contraseña: nuevaContraseña });

      return {
        mensaje: 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }

  /**
   * Middleware para verificar autenticación
   */
  middlewareAuth() {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return res.status(401).json({
            error: 'Token de autenticación requerido'
          });
        }

        const payload = this.verificarToken(token);
        const usuario = await Usuario.buscarPorId(payload.id_usuario);
        
        if (!usuario) {
          return res.status(401).json({
            error: 'Usuario no encontrado'
          });
        }

        req.usuario = usuario.toPublicObject();
        next();
      } catch (error) {
        return res.status(401).json({
          error: 'Token inválido o expirado'
        });
      }
    };
  }

  /**
   * Middleware para verificar rol de administrador
   */
  middlewareAdmin() {
    return (req, res, next) => {
      if (req.usuario.rol !== 'Administrador') {
        return res.status(403).json({
          error: 'Acceso denegado. Se requiere rol de administrador'
        });
      }
      next();
    };
  }
}

module.exports = new AuthService(); 