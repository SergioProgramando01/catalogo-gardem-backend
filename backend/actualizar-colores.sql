-- Agregar columna codigo_hex a la tabla Colores
USE gardem_db;

-- Agregar la columna codigo_hex
ALTER TABLE Colores ADD COLUMN codigo_hex VARCHAR(7) DEFAULT '#000000';

-- Actualizar colores existentes con códigos hexadecimales por defecto
UPDATE Colores SET codigo_hex = '#FF0000' WHERE nombre = 'Rojo';
UPDATE Colores SET codigo_hex = '#0000FF' WHERE nombre = 'Azul';
UPDATE Colores SET codigo_hex = '#FFFF00' WHERE nombre = 'Amarillo';
UPDATE Colores SET codigo_hex = '#00FF00' WHERE nombre = 'Verde';
UPDATE Colores SET codigo_hex = '#FF00FF' WHERE nombre = 'Magenta';
UPDATE Colores SET codigo_hex = '#00FFFF' WHERE nombre = 'Cian';
UPDATE Colores SET codigo_hex = '#000000' WHERE nombre = 'Negro';
UPDATE Colores SET codigo_hex = '#FFFFFF' WHERE nombre = 'Blanco';
UPDATE Colores SET codigo_hex = '#808080' WHERE nombre = 'Gris';
UPDATE Colores SET codigo_hex = '#800000' WHERE nombre = 'Marrón';