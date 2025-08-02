@echo off
echo Instalando dependencias del backend...
echo.

echo Instalando express...
npm install express

echo Instalando mysql2...
npm install mysql2

echo Instalando cors...
npm install cors

echo Instalando dotenv...
npm install dotenv

echo Instalando bcryptjs...
npm install bcryptjs

echo Instalando jsonwebtoken...
npm install jsonwebtoken

echo Instalando express-validator...
npm install express-validator

echo Instalando multer...
npm install multer

echo Instalando helmet...
npm install helmet

echo Instalando express-rate-limit...
npm install express-rate-limit

echo Instalando nodemon (dev dependency)...
npm install nodemon --save-dev

echo.
echo ¡Instalación completada!
echo.
echo Para probar la aplicación:
echo node start-app.js
pause

echo Creando archivo de configuración de ejemplo...
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

# Actualizar install.bat con instrucciones de BD
echo "@echo off
echo ========================================
echo   INSTALACION CATALOGO GARDEM BACKEND
echo ========================================
echo.

echo 1. Instalando dependencias del backend...
cd backend
npm install
echo.

echo 2. Configurando variables de entorno...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado. Por favor, edita las variables de entorno.
    echo.
    echo IMPORTANTE: Edita el archivo .env con tus credenciales de MySQL
    echo.
)
echo.

echo 3. Configurando base de datos...
echo.
echo Para configurar la base de datos, ejecuta uno de estos comandos:
echo.
echo Opcion A - Script completo (recomendado):
echo mysql -u root -p ^< ../database/gardem_db_schema.sql
echo.
echo Opcion B - Manual:
echo mysql -u root -p
echo CREATE DATABASE gardem_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo USE gardem_db;
echo source ../database/gardem_db_schema.sql;
echo.
echo 4. Verificando instalacion...
echo.
echo Para verificar que todo funciona:
echo - Health check: curl http://localhost:3000/health
echo - Test BD: node test-mysql-only.js
echo - Test general: node test-general-backend.js
echo.
echo 5. Instalacion completada!
echo.
echo Para iniciar el servidor:
echo npm run dev
echo.
echo Para mas informacion, consulta INSTALACION.md
pause" > install.bat

# Actualizar install.sh
echo '#!/bin/bash
echo "========================================"
echo "  INSTALACION CATALOGO GARDEM BACKEND"
echo "========================================"
echo ""

echo "1. Instalando dependencias del backend..."
cd backend
npm install
echo ""

echo "2. Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Archivo .env creado. Por favor, edita las variables de entorno."
    echo ""
    echo "IMPORTANTE: Edita el archivo .env con tus credenciales de MySQL"
    echo ""
fi
echo ""

echo "3. Configurando base de datos..."
echo ""
echo "Para configurar la base de datos, ejecuta uno de estos comandos:"
echo ""
echo "Opcion A - Script completo (recomendado):"
echo "mysql -u root -p < ../database/gardem_db_schema.sql"
echo ""
echo "Opcion B - Manual:"
echo "mysql -u root -p"
echo "CREATE DATABASE gardem_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "USE gardem_db;"
echo "source ../database/gardem_db_schema.sql;"
echo ""

echo "4. Verificando instalacion..."
echo ""
echo "Para verificar que todo funciona:"
echo "- Health check: curl http://localhost:3000/health"
echo "- Test BD: node test-mysql-only.js"
echo "- Test general: node test-general-backend.js"
echo ""

echo "5. Instalacion completada!"
echo ""
echo "Para iniciar el servidor:"
echo "npm run dev"
echo ""
echo "Para mas informacion, consulta INSTALACION.md"' > install.sh
chmod +x install.sh