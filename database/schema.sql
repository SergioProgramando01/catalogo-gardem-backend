-- =====================================================
-- SCRIPT SQL PARA LA BASE DE DATOS db_catalogo_gardem
-- Catálogo Gardem - Sistema de Gestión de Productos
-- =====================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS db_catalogo_gardem;
USE db_catalogo_gardem;

-- =====================================================
-- TABLA: USUARIOS
-- Almacena información de administradores y clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('Administrador', 'Cliente') DEFAULT 'Cliente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLA: CATEGORIAS
-- Organiza los productos en secciones
-- =====================================================
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLA: PRODUCTOS
-- Información general de cada artículo del catálogo
-- =====================================================
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    id_categoria INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
);

-- =====================================================
-- TABLA: TALLAS
-- Tabla maestra para las tallas disponibles
-- =====================================================
CREATE TABLE IF NOT EXISTS tallas (
    id_talla INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLA: COLORES
-- Tabla maestra para los colores disponibles
-- =====================================================
CREATE TABLE IF NOT EXISTS colores (
    id_color INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    codigo_hex VARCHAR(7) DEFAULT '#000000',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- TABLA: VARIANTES_PRODUCTO
-- Combinaciones de talla y color para cada producto
-- =====================================================
CREATE TABLE IF NOT EXISTS variantes_producto (
    id_variante INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_talla INT NOT NULL,
    id_color INT NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    stock_disponible INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_talla) REFERENCES tallas(id_talla) ON DELETE RESTRICT,
    FOREIGN KEY (id_color) REFERENCES colores(id_color) ON DELETE RESTRICT,
    UNIQUE KEY unique_variante (id_producto, id_talla, id_color)
);

-- =====================================================
-- TABLA: IMAGENES_PRODUCTO
-- URLs de las imágenes asociadas a un producto
-- =====================================================
CREATE TABLE IF NOT EXISTS imagenes_producto (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    url_imagen VARCHAR(500) NOT NULL,
    texto_alternativo VARCHAR(255),
    orden INT DEFAULT 0,
    es_principal BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

-- =====================================================
-- TABLA: CESTA_PEDIDO
-- Cesta de compra virtual de un usuario
-- =====================================================
CREATE TABLE IF NOT EXISTS cesta_pedido (
    id_cesta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- =====================================================
-- TABLA: ITEMS_CESTA
-- Cada línea de producto dentro de una cesta
-- =====================================================
CREATE TABLE IF NOT EXISTS items_cesta (
    id_item_cesta INT AUTO_INCREMENT PRIMARY KEY,
    id_cesta INT NOT NULL,
    id_variante INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cesta) REFERENCES cesta_pedido(id_cesta) ON DELETE CASCADE,
    FOREIGN KEY (id_variante) REFERENCES variantes_producto(id_variante) ON DELETE CASCADE,
    UNIQUE KEY unique_item_cesta (id_cesta, id_variante)
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- =====================================================

-- Índices para productos
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_productos_activo ON productos(activo);

-- Índices para variantes
CREATE INDEX idx_variantes_producto ON variantes_producto(id_producto);
CREATE INDEX idx_variantes_talla ON variantes_producto(id_talla);
CREATE INDEX idx_variantes_color ON variantes_producto(id_color);
CREATE INDEX idx_variantes_disponible ON variantes_producto(disponible);

-- Índices para imágenes
CREATE INDEX idx_imagenes_producto ON imagenes_producto(id_producto);
CREATE INDEX idx_imagenes_orden ON imagenes_producto(orden);

-- Índices para cesta
CREATE INDEX idx_cesta_usuario ON cesta_pedido(id_usuario);
CREATE INDEX idx_cesta_activa ON cesta_pedido(activa);

-- Índices para items cesta
CREATE INDEX idx_items_cesta ON items_cesta(id_cesta);
CREATE INDEX idx_items_variante ON items_cesta(id_variante);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar tallas básicas
INSERT IGNORE INTO tallas (nombre) VALUES 
('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL');

-- Insertar colores básicos
INSERT IGNORE INTO colores (nombre, codigo_hex) VALUES 
('Negro', '#000000'),
('Blanco', '#FFFFFF'),
('Azul', '#0000FF'),
('Rojo', '#FF0000'),
('Verde', '#008000'),
('Gris', '#808080'),
('Azul Marino', '#000080'),
('Rojo Oscuro', '#8B0000');

-- Insertar categorías de ejemplo
INSERT IGNORE INTO categorias (nombre, descripcion) VALUES 
('Ropa Interior Hombre', 'Ropa interior masculina'),
('Ropa Deportiva Mujer', 'Ropa deportiva para mujeres'),
('Ropa Casual Hombre', 'Ropa casual masculina'),
('Ropa Casual Mujer', 'Ropa casual femenina'),
('Accesorios', 'Accesorios varios');

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (debe ser hasheada en la aplicación)
INSERT IGNORE INTO usuarios (nombre_usuario, email, contraseña, rol) VALUES 
('admin', 'admin@gardem.com', '$2b$10$rQZ8K9mN2pL1vX3yA6bC7dE8fG9hI0jK1lM2nO3pQ4rS5tU6vW7xY8zA9bC0dE', 'Administrador');

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para productos con información completa
CREATE OR REPLACE VIEW vista_productos_completos AS
SELECT 
    p.id_producto,
    p.nombre,
    p.descripcion,
    p.precio,
    c.nombre as categoria,
    c.id_categoria,
    p.fecha_creacion,
    p.activo
FROM productos p
JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.activo = TRUE AND c.activo = TRUE;

-- Vista para variantes con información completa
CREATE OR REPLACE VIEW vista_variantes_completas AS
SELECT 
    vp.id_variante,
    vp.id_producto,
    p.nombre as nombre_producto,
    t.nombre as talla,
    c.nombre as color,
    c.codigo_hex,
    vp.disponible,
    vp.stock_disponible,
    p.precio
FROM variantes_producto vp
JOIN productos p ON vp.id_producto = p.id_producto
JOIN tallas t ON vp.id_talla = t.id_talla
JOIN colores c ON vp.id_color = c.id_color
WHERE p.activo = TRUE AND t.activo = TRUE AND c.activo = TRUE;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =====================================================

-- Procedimiento para obtener productos por categoría
DELIMITER //
CREATE PROCEDURE ObtenerProductosPorCategoria(IN categoria_id INT)
BEGIN
    SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        c.nombre as categoria
    FROM productos p
    JOIN categorias c ON p.id_categoria = c.id_categoria
    WHERE p.id_categoria = categoria_id AND p.activo = TRUE
    ORDER BY p.nombre;
END //
DELIMITER ;

-- Procedimiento para obtener variantes disponibles de un producto
DELIMITER //
CREATE PROCEDURE ObtenerVariantesDisponibles(IN producto_id INT)
BEGIN
    SELECT 
        vp.id_variante,
        t.nombre as talla,
        c.nombre as color,
        c.codigo_hex,
        vp.stock_disponible
    FROM variantes_producto vp
    JOIN tallas t ON vp.id_talla = t.id_talla
    JOIN colores c ON vp.id_color = c.id_color
    WHERE vp.id_producto = producto_id AND vp.disponible = TRUE
    ORDER BY t.nombre, c.nombre;
END //
DELIMITER ;

-- =====================================================
-- TRIGGERS PARA MANTENER INTEGRIDAD
-- =====================================================

-- Trigger para actualizar fecha_actualizacion en productos
DELIMITER //
CREATE TRIGGER actualizar_fecha_producto
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger para actualizar fecha_actualizacion en variantes
DELIMITER //
CREATE TRIGGER actualizar_fecha_variante
BEFORE UPDATE ON variantes_producto
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

SELECT 'Base de datos db_catalogo_gardem creada exitosamente!' as mensaje; 