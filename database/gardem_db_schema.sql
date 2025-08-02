-- =====================================================
-- SCRIPT PARA LA BASE DE DATOS gardem_db
-- Estructura existente del catálogo Gardem
-- =====================================================

-- Crear la base de datos si no existe y seleccionarla
CREATE DATABASE IF NOT EXISTS gardem_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gardem_db;

-- -----------------------------------------------------
-- Tabla: Usuarios
-- Almacena administradores y futuros clientes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  rol ENUM('Administrador', 'Cliente') NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Tabla: Categorias
-- Para organizar los productos (ej: Ropa Deportiva, Ropa Interior)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- -----------------------------------------------------
-- Tabla: Tallas
-- Tabla maestra para las tallas (S, M, L, etc.)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Tallas (
  id_talla INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(10) UNIQUE NOT NULL
);

-- -----------------------------------------------------
-- Tabla: Colores
-- Tabla maestra para los colores
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Colores (
  id_color INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

-- -----------------------------------------------------
-- Tabla: Productos
-- El catálogo principal de artículos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  id_categoria INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria)
);

-- -----------------------------------------------------
-- Tabla: VariantesProducto
-- Conecta Productos con Tallas y Colores para gestionar el stock
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS VariantesProducto (
  id_variante INT AUTO_INCREMENT PRIMARY KEY,
  id_producto INT NOT NULL,
  id_talla INT NOT NULL,
  id_color INT NOT NULL,
  disponible BOOLEAN DEFAULT TRUE,
  UNIQUE(id_producto, id_talla, id_color), -- Evita duplicados de la misma variante
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE,
  FOREIGN KEY (id_talla) REFERENCES Tallas(id_talla),
  FOREIGN KEY (id_color) REFERENCES Colores(id_color)
);

-- -----------------------------------------------------
-- Tabla: ImagenesProducto
-- Almacena las imágenes de cada producto
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ImagenesProducto (
  id_imagen INT AUTO_INCREMENT PRIMARY KEY,
  id_producto INT NOT NULL,
  url_imagen VARCHAR(255) NOT NULL,
  texto_alternativo VARCHAR(255),
  FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Tabla: CestaPedido
-- La cesta de compra virtual del usuario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS CestaPedido (
  id_cesta INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NULL, -- Permite cestas de invitados
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- Tabla: ItemsCesta
-- Los artículos específicos dentro de una cesta
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS ItemsCesta (
  id_item_cesta INT AUTO_INCREMENT PRIMARY KEY,
  id_cesta INT NOT NULL,
  id_variante INT NOT NULL,
  cantidad INT NOT NULL,
  FOREIGN KEY (id_cesta) REFERENCES CestaPedido(id_cesta) ON DELETE CASCADE,
  FOREIGN KEY (id_variante) REFERENCES VariantesProducto(id_variante)
);

-- --- Inserciones de datos iniciales (Ejemplos) ---

-- Insertar tallas básicas
INSERT IGNORE INTO Tallas (nombre) VALUES ('S'), ('M'), ('L'), ('XL');

-- Insertar colores básicos
INSERT IGNORE INTO Colores (nombre) VALUES ('Negro'), ('Blanco'), ('Gris'), ('Azul');

-- Insertar categorías básicas
INSERT IGNORE INTO Categorias (nombre, descripcion) VALUES 
('Ropa Interior Hombre', 'Ropa interior masculina'),
('Ropa Deportiva Mujer', 'Ropa deportiva femenina'),
('Niños/Niñas', 'Ropa para niños y niñas');

-- Insertar usuario administrador (contraseña: admin123)
INSERT IGNORE INTO Usuarios (nombre_usuario, email, contraseña, rol) VALUES 
('admin_gardem', 'admin@gardem.com', '$2a$10$rQZ8K9mN2pL1vX3yW4uJ5e', 'Administrador');

-- Mostrar mensaje de confirmación
SELECT 'Base de datos gardem_db configurada exitosamente!' as mensaje; 