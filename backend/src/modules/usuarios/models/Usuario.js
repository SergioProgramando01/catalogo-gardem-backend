const { executeQuery } = require('../../../database/connection');
const bcrypt = require('bcryptjs');

class Usuario {
  constructor(data = {}) {
    this.id_usuario = data.id_usuario;
    this.nombre_usuario = data.nombre_usuario;
    this.email = data.email;
    this.contraseña = data.contraseña;
    this.rol = data.rol;
    this.fecha_creacion = data.fecha_creacion;
  }

  /**
   * Crear un nuevo usuario
   */
  static async crear(usuarioData) {
    try {
      // Cifrar la contraseña
      const saltRounds = 10;
      const contraseñaCifrada = await bcrypt.hash(usuarioData.contraseña, saltRounds);

      const sql = `
        INSERT INTO Usuarios (nombre_usuario, email, contraseña, rol)
        VALUES (?, ?, ?, ?)
      `;
      
      const params = [
        usuarioData.nombre_usuario,
        usuarioData.email,
        contraseñaCifrada,
        usuarioData.rol || 'Cliente'
      ];

      const result = await executeQuery(sql, params);
      return new Usuario({ id_usuario: result.insertId, ...usuarioData });
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Buscar usuario por email
   */
  static async buscarPorEmail(email) {
    try {
      const sql = 'SELECT * FROM Usuarios WHERE email = ?';
      const usuarios = await executeQuery(sql, [email]);
      return usuarios.length > 0 ? new Usuario(usuarios[0]) : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  /**
   * Buscar usuario por ID
   */
  static async buscarPorId(id_usuario) {
    try {
      const sql = 'SELECT * FROM Usuarios WHERE id_usuario = ?';
      const usuarios = await executeQuery(sql, [id_usuario]);
      return usuarios.length > 0 ? new Usuario(usuarios[0]) : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }

  /**
   * Obtener todos los usuarios
   */
  static async obtenerTodos() {
    try {
      const sql = 'SELECT id_usuario, nombre_usuario, email, rol, fecha_creacion FROM Usuarios';
      const usuarios = await executeQuery(sql);
      return usuarios.map(usuario => new Usuario(usuario));
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  /**
   * Actualizar usuario
   */
  static async actualizar(id_usuario, datosActualizados) {
    try {
      let sql = 'UPDATE Usuarios SET ';
      const params = [];
      const campos = [];

      // Construir la consulta dinámicamente
      if (datosActualizados.nombre_usuario) {
        campos.push('nombre_usuario = ?');
        params.push(datosActualizados.nombre_usuario);
      }
      if (datosActualizados.email) {
        campos.push('email = ?');
        params.push(datosActualizados.email);
      }
      if (datosActualizados.rol) {
        campos.push('rol = ?');
        params.push(datosActualizados.rol);
      }
      if (datosActualizados.contraseña) {
        const saltRounds = 10;
        const contraseñaCifrada = await bcrypt.hash(datosActualizados.contraseña, saltRounds);
        campos.push('contraseña = ?');
        params.push(contraseñaCifrada);
      }

      if (campos.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      sql += campos.join(', ') + ' WHERE id_usuario = ?';
      params.push(id_usuario);

      await executeQuery(sql, params);
      return await this.buscarPorId(id_usuario);
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Eliminar usuario
   */
  static async eliminar(id_usuario) {
    try {
      const sql = 'DELETE FROM Usuarios WHERE id_usuario = ?';
      await executeQuery(sql, [id_usuario]);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  /**
   * Verificar contraseña
   */
  async verificarContraseña(contraseña) {
    return await bcrypt.compare(contraseña, this.contraseña);
  }

  /**
   * Convertir a objeto público (sin contraseña)
   */
  toPublicObject() {
    const { contraseña, ...usuarioPublico } = this;
    return usuarioPublico;
  }
}

module.exports = Usuario; 