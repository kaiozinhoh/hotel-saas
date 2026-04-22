#!/bin/bash

echo "=== INICIANDO APLICAÇÃO HOTEL MANAGER ==="

# Script de inicialização que roda toda vez que o container inicia
# Verifica e configura o banco se necessário

# Verificar se a tabela migrations existe
TABLE_EXISTS=$(php artisan tinker --execute="
try {
    \Schema::hasTable('migrations');
    echo 'true';
} catch(\Exception \$e) {
    echo 'false';
}
" 2>/dev/null | tr -d '\r\n')

echo "Verificando configuração do banco..."

if [ "$TABLE_EXISTS" = "false" ]; then
    echo "Primeira inicialização detectada. Configurando banco..."
    
    # Criar .env se não existir (usando variáveis do EasyPanel)
    if [ ! -f .env ]; then
        echo "Criando arquivo .env com variáveis do EasyPanel..."
        cat > .env << EOF
APP_NAME="\${APP_NAME:-Exchange Hotel}"
APP_ENV="\${APP_ENV:-production}"
APP_DEBUG="\${APP_DEBUG:-false}"
APP_URL="\${APP_URL:-https://www.exchangesistemas.com.br/demo-hotel}"
APP_KEY="\${APP_KEY:-base64:hqUlRmDKFXK8nJDvwF/iGS44ZXXdpQMLuRN+UqJOuWo=}"
DB_CONNECTION="\${DB_CONNECTION:-mysql}"
DB_HOST="\${DB_HOST:-172.17.0.1:5174}"
DB_PORT="\${DB_PORT:-3305}"
DB_DATABASE="\${DB_DATABASE:-exchange-hotel}"
DB_USERNAME="\${DB_USERNAME:-root}"
DB_PASSWORD="\${DB_PASSWORD:-Kaio@3005}"
EOF
    fi
    
    # Executar migrate e seed
    php artisan migrate --force
    php artisan db:seed --force
    
    echo "Banco configurado com sucesso!"
else
    echo "Banco já configurado. Verificando atualizações..."
    
    # Verificar migrations pendentes
    PENDING=$(php artisan migrate:status 2>/dev/null | grep -c "Pending" || echo "0")
    
    if [ "$PENDING" -gt 0 ]; then
        echo "Aplicando $PENDING migrations pendentes..."
        php artisan migrate --force
    fi
fi

# Garantir que storage link exista
php artisan storage:link

# Limpar caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "=== APLICAÇÃO PRONTA! INICIANDO APACHE ==="

# Iniciar Apache
exec apache2-foreground
