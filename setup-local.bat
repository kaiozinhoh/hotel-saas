@echo off
echo ========================================
echo    Hotel Manager - Setup Local Windows
echo ========================================
echo.

echo [1/8] Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker nao encontrado!
    echo Instale Docker Desktop primeiro.
    pause
    exit /b 1
)
echo Docker OK!

echo.
echo [2/8] Construido imagem Docker...
docker build -t hotel-manager-local .
if %errorlevel% neq 0 (
    echo ERRO: Falha ao construir imagem!
    pause
    exit /b 1
)
echo Imagem construida com sucesso!

echo.
echo [3/8] Criando banco SQLite...
if not exist "database" mkdir database
if not exist "database\database.sqlite" (
    type nul > database\database.sqlite
    echo Banco SQLite criado!
) else (
    echo Banco SQLite ja existe!
)

echo.
echo [4/8] Criando .env.local...
echo APP_NAME="Hotel Manager Local" > .env.local
echo APP_ENV=local >> .env.local
echo APP_DEBUG=true >> .env.local
echo APP_URL=http://localhost:8000 >> .env.local
echo APP_KEY=base64:hqUlRmDKFXK8nJDvwF/iGS44ZXXdpQMLuRN+UqJOuWo= >> .env.local
echo. >> .env.local
echo DB_CONNECTION=sqlite >> .env.local
echo DB_DATABASE=/var/www/html/database/database.sqlite >> .env.local
echo. >> .env.local
echo CACHE_DRIVER=file >> .env.local
echo SESSION_DRIVER=file >> .env.local
echo QUEUE_CONNECTION=sync >> .env.local
echo .env.local criado!

echo.
echo [5/8] Iniciando container...
docker run -d --name hotel-manager-local -p 8000:80 ^
    -v "%cd%":/var/www/html ^
    -v "%cd%\storage":/var/www/html/storage ^
    -v "%cd%\bootstrap\cache":/var/www/html/bootstrap/cache ^
    hotel-manager-local

if %errorlevel% neq 0 (
    echo ERRO: Falha ao iniciar container!
    pause
    exit /b 1
)
echo Container iniciado!

echo.
echo [6/8] Configurando aplicacao...
docker exec hotel-manager-local php artisan migrate --force
docker exec hotel-manager-local php artisan db:seed --force
docker exec hotel-manager-local php artisan storage:link
docker exec hotel-manager-local php artisan config:clear
docker exec hotel-manager-local php artisan cache:clear

echo.
echo [7/8] Compilando assets...
docker exec hotel-manager-local npm run build

echo.
echo [8/8] Configurando hosts...
echo.
echo Adicione estas linhas ao arquivo C:\Windows\System32\drivers\etc\hosts:
echo.
echo 127.0.0.1   localhost
echo 127.0.0.1   www.localhost
echo 127.0.0.1   maerainha.localhost
echo 127.0.0.1   hotelabc.localhost
echo.
echo (Abra como Administrador para editar)
echo.

echo ========================================
echo           SETUP CONCLUIDO!
echo ========================================
echo.
echo Acesse:
echo - Aplicacao: http://localhost:8000
echo - Painel Admin: http://www.localhost:8000
echo.
echo Credenciais:
echo - Email: superadmin@saas.com
echo - Senha: password
echo.
echo Comandos uteis:
echo - Ver logs: docker logs hotel-manager-local -f
echo - Parar: docker stop hotel-manager-local
echo - Reiniciar: docker restart hotel-manager-local
echo.
pause
