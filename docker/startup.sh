#!/bin/bash

echo "=== INICIANDO HOTEL MANAGER - DOCKER COMPOSE ==="

# Verificar se banco está conectado e acessível
if php artisan migrate:status > /dev/null 2>&1; then
    echo "Banco conectado. Verificando migrations pendentes..."
    
    # Verificar apenas migrations realmente pendentes
    PENDING_COUNT=$(php artisan migrate:status 2>/dev/null | grep -c "Pending" || echo "0")
    
    if [ "$PENDING_COUNT" -gt 0 ]; then
        echo "Aplicando $PENDING_COUNT migrations pendentes..."
        php artisan migrate --force
    else
        echo "Nenhuma migration pendente."
    fi
else
    echo "Banco não configurado. Executando migrate inicial..."
    
    # Executar migrate usando variáveis do Docker Compose
    php artisan migrate --force
    
    # Executar seed apenas na primeira vez
    php artisan db:seed --force
    
    echo "Banco configurado com sucesso!"
fi

# Garantir storage link
php artisan storage:link

# Limpar caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "=== APLICAÇÃO PRONTA! INICIANDO APACHE ==="

# Iniciar Apache
exec apache2-foreground
