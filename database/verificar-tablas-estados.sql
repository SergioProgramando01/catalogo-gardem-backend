-- =====================================================
-- SCRIPT PARA VERIFICAR Y CREAR TABLAS NECESARIAS
-- =====================================================

USE gardem_db;

-- Verificar si las tablas existen
SHOW TABLES LIKE '%pedido%';

-- Si no existen, crearlas
CREATE TABLE IF NOT EXISTS Pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  numero_pedido VARCHAR(50) UNIQUE NOT NULL,
  estado ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
  subtotal DECIMAL(10, 2) NOT NULL,
  impuestos DECIMAL(10, 2) DEFAULT 0.00,
  descuentos DECIMAL(10, 2) DEFAULT 0.00,
  total_pedido DECIMAL(10, 2) NOT NULL,
  fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS EstadosPedido (
  id_estado_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  estado ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado') NOT NULL,
  comentario TEXT,
  fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- Insertar datos de ejemplo si no existen
INSERT IGNORE INTO Pedidos (id_usuario, numero_pedido, estado, subtotal, total_pedido) VALUES 
(2, 'PED-001', 'pendiente', 77.97, 77.97);

-- Insertar estados de ejemplo
INSERT IGNORE INTO EstadosPedido (id_pedido, estado, comentario, id_usuario) VALUES 
(1, 'pendiente', 'Pedido creado', 2);

-- Mostrar mensaje de confirmación
SELECT 'Tablas verificadas y datos de ejemplo insertados!' as mensaje; 