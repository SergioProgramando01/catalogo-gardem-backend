# 🚀 Guía de Instalación - Catálogo Gardem Backend

## 📋 Prerrequisitos
- Node.js (versión 14 o superior)
- MySQL (XAMPP recomendado)
- npm o yarn

## ⚡ Instalación Rápida

### **Windows:**
```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd catalogo-gardem

# 2. Ejecutar instalación automática
install.bat
```

### **Linux/Mac:**
```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd catalogo-gardem

# 2. Ejecutar instalación automática
./install.sh
```

## �� Instalación Manual

### **1. Instalar dependencias:**
```bash
cd backend
npm install
```

### **2. Configurar base de datos:**
```bash
# Crear base de datos
mysql -u root -p < database/gardem_db_schema.sql
```

### **3. Configurar variables de entorno:**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus datos
nano .env
```

### **4. Iniciar servidor:**
```bash
npm run dev
```

## 🧪 Verificar instalación

```bash
# Probar health check
curl http://localhost:3000/health

# Ejecutar testeo general
node test-general-backend.js
```

## 📊 Estructura del proyecto

```
catalogo-gardem/
├── backend/              # API principal
├── database/             # Scripts de BD
├── install.bat          # Instalador Windows
├── install.sh           # Instalador Linux/Mac
└── INSTALACION.md       # Esta guía
```

## 🆘 Solución de problemas

### **Error de conexión a BD:**
- Verificar que MySQL esté ejecutándose
- Revisar credenciales en `.env`
- Verificar que la BD `gardem_db` exista

### **Error de dependencias:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### **Error de puerto:**
- Cambiar `PORT` en `.env`
- Verificar que el puerto no esté en uso
```

## ⚠️ Problemas sin .gitignore

### **1. Archivos que NO deberían subirse:**
- `node_modules/` - Muy pesado (cientos de MB)
- `.env` - Contiene contraseñas y datos sensibles
- `logs/` - Archivos temporales
- Archivos del sistema (`.DS_Store`, `Thumbs.db`)

### **2. Consecuencias:**
- **Repositorio muy pesado** (node_modules puede ser 500MB+)
- **Datos sensibles expuestos** (contraseñas de BD)
- **Conflictos entre equipos** (archivos específicos del sistema)
- **Descarga lenta** para otros desarrolladores

## ️ Solución: Crear .gitignore correcto

```bash
# Crear .gitignore en la raíz del proyecto
cd /c/Users/SERGIO/Desktop/DESARROLLOS/catalogo-gardem
```

```bash
# Crear el archivo .gitignore
echo "# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database files (opcional - si quieres incluir los scripts SQL)
# *.sql
# *.db

# Uploads
uploads/
public/uploads/

# Temporary files
tmp/
temp/

# Test files (opcional)
test-*.js
*.test.js" > .gitignore
```

## 📋 Pasos para que funcione en otro equipo

### **1. Crear archivo de configuración de ejemplo**
```bash
# Crear .env.example
echo "# Configuración de la base de datos
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
RATE_LIMIT_MAX_REQUESTS=100" > backend/.env.example
```

### **2. Crear script de instalación**
```bash
# Crear install.bat (Windows)
echo "@echo off
echo Instalando dependencias del backend...
cd backend
npm install
echo.
echo Configurando variables de entorno...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado. Por favor, edita las variables de entorno.
)
echo.
echo Instalacion completada!
echo Para iniciar el servidor: npm run dev
pause" > install.bat
```

```bash
# Crear install.sh (Linux/Mac)
echo '#!/bin/bash
echo "Instalando dependencias del backend..."
cd backend
npm install
echo ""
echo "Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Archivo .env creado. Por favor, edita las variables de entorno."
fi
echo ""
echo "Instalacion completada!"
echo "Para iniciar el servidor: npm run dev"' > install.sh
chmod +x install.sh
```

### **3. Crear README de instalación**
```markdown:INSTALACION.md
# 🚀 Guía de Instalación - Catálogo Gardem Backend

## 📋 Prerrequisitos
- Node.js (versión 14 o superior)
- MySQL (XAMPP recomendado)
- npm o yarn

## ⚡ Instalación Rápida

### **Windows:**
```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd catalogo-gardem

# 2. Ejecutar instalación automática
install.bat
```

### **Linux/Mac:**
```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd catalogo-gardem

# 2. Ejecutar instalación automática
./install.sh
```

##  Instalación Manual

### **1. Instalar dependencias:**
```bash
cd backend
npm install
```

### **2. Configurar base de datos:**
```bash
# Crear base de datos
mysql -u root -p < database/gardem_db_schema.sql
```

### **3. Configurar variables de entorno:**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus datos
nano .env
```

### **4. Iniciar servidor:**
```bash
npm run dev
```

## 🧪 Verificar instalación

```bash
# Probar health check
curl http://localhost:3000/health

# Ejecutar testeo general
node test-general-backend.js
```

## 📊 Estructura del proyecto
```
catalogo-gardem/
├── backend/              # API principal
├── database/             # Scripts de BD
├── install.bat          # Instalador Windows
├── install.sh           # Instalador Linux/Mac
└── INSTALACION.md       # Esta guía
```

## 🆘 Solución de problemas

### **Error de conexión a BD:**
- Verificar que MySQL esté ejecutándose
- Revisar credenciales en `.env`
- Verificar que la BD `gardem_db` exista

### **Error de dependencias:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### **Error de puerto:**
- Cambiar `PORT` en `.env`
- Verificar que el puerto no esté en uso
```

##  Comandos Git finales

```bash
# Agregar archivos nuevos
git add .gitignore
git add backend/.env.example
git add install.bat
git add install.sh
git add INSTALACION.md

# Commit
git commit -m "📦 Agregar archivos de instalación y configuración

✅ .gitignore - Excluir archivos sensibles
✅ .env.example - Configuración de ejemplo
✅ install.bat/sh - Scripts de instalación automática
✅ INSTALACION.md - Guía completa de instalación

🚀 Listo para distribución en equipo"

# Subir
git push
```

## ✅ Beneficios de esta configuración

1. **Repositorio limpio** - Sin archivos innecesarios
2. **Instalación fácil** - Scripts automáticos
3. **Configuración segura** - Variables de entorno protegidas
4. **Documentación clara** - Guía paso a paso
5. **Funciona en cualquier equipo** - Configuración portable

¿Te parece bien esta configuración? ¿Quieres que ajuste algo específico? 