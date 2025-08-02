-- =====================================================
-- ACTUALIZACIÓN DE LA TABLA CATEGORIAS
-- Agregar campo activa para soft delete
-- =====================================================

USE gardem_db;

-- Agregar campo activa a la tabla Categorias
ALTER TABLE Categorias 
ADD COLUMN activa BOOLEAN DEFAULT TRUE AFTER descripcion;

-- Agregar campo fecha_creacion si no existe
ALTER TABLE Categorias 
ADD COLUMN fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER activa;

-- Crear índice para mejorar consultas por estado activo
CREATE INDEX idx_categorias_activa ON Categorias(activa);

-- Crear índice para mejorar consultas por nombre
CREATE INDEX idx_categorias_nombre ON Categorias(nombre);

-- Verificar la estructura actualizada
DESCRIBE Categorias; 