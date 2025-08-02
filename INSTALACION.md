# 🚀 Guía de Instalación - Catálogo Gardem Backend

## 📋 Prerrequisitos
- Node.js (versión 14 o superior)
- MySQL (XAMPP recomendado)
- npm o yarn

## ⚡ Instalación Rápida

### **Windows:**
```bash
# 1. Clonar el repositorio
git clone https://github.com/SergioProgramando01/catalogo-gardem-backend.git
cd catalogo-gardem-backend

# 2. Ejecutar instalación automática
install.bat
```

### **Linux/Mac:**
```bash
# 1. Clonar el repositorio
git clone https://github.com/SergioProgramando01/catalogo-gardem-backend.git
cd catalogo-gardem-backend

# 2. Ejecutar instalación automática
./install.sh
```

## 🗄️ Configuración de Base de Datos

### **Opción A - Script Automático (Recomendado):**
```bash
mysql -u root -p < database/gardem_db_schema.sql
```

### **Opción B - Manual:**
```bash
mysql -u root -p
CREATE DATABASE gardem_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gardem_db;
source database/gardem_db_schema.sql;
```

### **Verificar Base de Datos:**
```bash
mysql -u root -p gardem_db
SHOW TABLES;
SELECT * FROM Tallas;
SELECT * FROM Colores;
SELECT * FROM Categorias;
```

## ⚙️ Configuración de Variables de Entorno

Editar `backend/.env`:
```env
# Configuración de la base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=gardem_db
DB_PORT=3306

# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h

# Configuración de seguridad
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Verificar Instalación

```bash
# Probar conexión a BD
cd backend
node test-mysql-only.js

# Probar health check
curl http://localhost:3000/health

# Ejecutar testeo general
node test-general-backend.js
```

##  Iniciar Servidor

```bash
cd backend
npm run dev
```

##  Estructura del Proyecto

```
catalogo-gardem-backend/
├── backend/              # API principal
│   ├── src/
│   │   ├── modules/      # 12 módulos MVC
│   │   ├── config/
│   │   ├── database/
│   │   └── utils/
│   ├── package.json
│   ├── README.md
│   └── test-*.js        # Scripts de prueba
├── database/
│   └── *.sql            # Scripts de base de datos
├── install.bat          # Instalador Windows
├── install.sh           # Instalador Linux/Mac
└── INSTALACION.md       # Esta guía
```

## 🚀 Comandos para subir todo

```bash
# Agregar archivos actualizados
git add install.bat
git add install.sh
git add INSTALACION.md
git add database/

# Commit
git commit -m " Actualizar scripts de instalación con configuración de BD

✅ install.bat - Script Windows con instrucciones de BD
✅ install.sh - Script Linux/Mac con instrucciones de BD
✅ INSTALACION.md - Guía completa actualizada
✅ database/ - Scripts SQL para configuración automática

️ Incluye:
- Instrucciones paso a paso para BD
- Scripts automáticos de instalación
- Verificación de instalación
- Solución de problemas comunes

🚀 Listo para instalación completa en otros equipos"

# Subir
git push
```

¿Te parece bien esta configuración? ¿Quieres que ajuste algo en los scripts de instalación? 

## 🚀 Comandos para incluir todo

```bash
# Agregar archivos de BD
git add database/
git add DATABASE.md

# Actualizar script de instalación
git add install.bat

# Commit
git commit -m "️ Agregar configuración de base de datos

✅ database/ - Scripts SQL completos
✅ DATABASE.md - Guía completa de configuración de BD
✅ install.bat - Script actualizado con instrucciones de BD

📊 Incluye:
- 12 tablas con relaciones
- Datos iniciales (tallas, colores, categorías)
- Usuario admin por defecto
- Scripts de verificación

🚀 Listo para instalación completa en otros equipos"

# Subir
git push
```

## ✅ Recomendación Final

**SÍ incluir los scripts SQL** porque:
- Son necesarios para que otros equipos funcionen
- No contienen datos sensibles (solo estructura)
- Permiten instalación automática
- Están versionados y controlados

¿Te parece bien esta configuración? ¿Quieres que agregue algo más específico sobre la base de datos?
