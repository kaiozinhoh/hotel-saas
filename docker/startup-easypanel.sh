#!/bin/bash

echo "=== INICIANDO HOTEL MANAGER - MODO EASYPANEL ==="

# Sistema 100% compatível com EasyPanel
# NÃO cria .env físico - usa apenas variáveis de ambiente

echo "Verificando configuração do banco..."

# Verificar se tabela migrations existe
TABLE_EXISTS=$(php artisan tinker --execute="
try {
    \Schema::hasTable('migrations');
    echo 'true';
} catch(\Exception \$e) {
    echo 'false';
}
" 2>/dev/null | tr -d '\r\n')

if [ "$TABLE_EXISTS" = "false" ]; then
    echo "Banco não configurado. Executando migrate..."
    
    # Executar migrate usando variáveis do EasyPanel
    php artisan migrate --force
    
    # Executar seed apenas na primeira vez
    php artisan db:seed --force
    
    echo "Banco configurado com sucesso!"
else
    echo "Banco já existe. Verificando migrations pendentes..."
    
    # Verificar apenas migrations realmente pendentes
    PENDING_COUNT=$(php artisan migrate:status 2>/dev/null | grep -c "Pending" || echo "0")
    
    if [ "$PENDING_COUNT" -gt 0 ]; then
        echo "Aplicando $PENDING_COUNT migrations pendentes..."
        php artisan migrate --force
    else
        echo "Nenhuma migration pendente."
    fi
fi

# Garantir storage link
php artisan storage:link

# Limpar caches (importante para pegar variáveis do EasyPanel)
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "=== APLICAÇÃO PRONTA! INICIANDO APACHE ==="

# Iniciar Apache
exec apache2-foreground
