#!/bin/bash

echo "=== DIAGNÓSTICO LARAVEL ==="
echo ""

# 1. Verificar se o .env existe
echo "1. Verificando .env:"
if [ -f .env ]; then
    echo "   .env existe"
    echo "   Conteúdo do .env:"
    cat .env | head -10
else
    echo "   .env NÃO existe - CRIANDO..."
    echo "APP_NAME=Exchange Hotel" > .env
    echo "APP_ENV=production" >> .env
    echo "APP_DEBUG=false" >> .env
    echo "APP_URL=https://www.exchangesistemas.com.br/demo-hotel" >> .env
    echo "APP_KEY=base64:hqUlRmDKFXK8nJDvwF/iGS44ZXXdpQMLuRN+UqJOuWo=" >> .env
    echo "DB_CONNECTION=mysql" >> .env
    echo "DB_HOST=172.17.0.1:5174" >> .env
    echo "DB_PORT=3305" >> .env
    echo "DB_DATABASE=exchange-hotel" >> .env
    echo "DB_USERNAME=root" >> .env
    echo "DB_PASSWORD=Kaio@3005" >> .env
    echo "ASSET_URL=https://www.exchangesistemas.com.br/demo-hotel/public" >> .env
fi

echo ""

# 2. Testar conexão com banco
echo "2. Testando conexão MySQL:"
php artisan tinker --execute="
try {
    \DB::connection()->getPdo();
    echo '   Conexão MySQL: OK\n';
} catch(\Exception \$e) {
    echo '   Conexão MySQL: FALHOU - ' . \$e->getMessage() . '\n';
}
"

echo ""

# 3. Verificar permissões
echo "3. Verificando permissões:"
ls -la storage/
ls -la bootstrap/cache/

echo ""

# 4. Testar configuração Laravel
echo "4. Testando configuração Laravel:"
php artisan config:clear
php artisan cache:clear

echo ""

# 5. Rodar migrate se necessário
echo "5. Verificando se migrate é necessário:"
php artisan migrate:status

echo ""

echo "=== FIM DO DIAGNÓSTICO ==="
