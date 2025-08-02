const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

/**
 * Función para probar la conexión a la base de datos
 * @returns {Promise<boolean>} - true si la conexión es exitosa, false en caso contrario
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Error al probar conexión:', error.message);
    return false;
  }
}

/**
 * Función para ejecutar consultas SQL
 * @param {string} sql - Consulta SQL a ejecutar
 * @param {Array} params - Parámetros para la consulta
 * @returns {Promise<Array>} - Resultado de la consulta
 */
async function executeQuery(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Error al ejecutar consulta:', error.message);
    throw error;
  }
}

/**
 * Función para obtener una conexión del pool
 * @returns {Promise<Connection>} - Conexión de MySQL
 */
async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error al obtener conexión:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  executeQuery,
  getConnection
}; 