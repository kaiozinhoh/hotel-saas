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

# Verificar se assets precisam ser recompilados
NEEDS_REBUILD=false

# Verificar se pasta build existe
if [ ! -d "public/build" ]; then
    echo "Pasta build não existe. Precisa compilar."
    NEEDS_REBUILD=true
else
    # Verificar se o domínio mudou (comparar com assets gerados)
    CURRENT_DOMAIN=$(echo $APP_URL | sed -E 's|^https?://||' | sed 's|/.*||')
    ASSET_DOMAIN_FILE="public/build/.domain"
    
    if [ -f "$ASSET_DOMAIN_FILE" ]; then
        ASSET_DOMAIN=$(cat "$ASSET_DOMAIN_FILE")
        if [ "$CURRENT_DOMAIN" != "$ASSET_DOMAIN" ]; then
            echo "Domínio mudou de $ASSET_DOMAIN para $CURRENT_DOMAIN. Recompilando assets."
            NEEDS_REBUILD=true
        fi
    else
        echo "Primeira vez. Compilando assets."
        NEEDS_REBUILD=true
    fi
fi

if [ "$NEEDS_REBUILD" = true ]; then
    echo "Compilando assets (Vite)..."
    
    # Instalar dependências NPM se necessário
    if [ ! -d "node_modules" ]; then
        echo "Instalando dependências NPM..."
        npm install
    fi
    
    # Limpar build anterior
    rm -rf public/build
    
    # Compilar assets para produção
    npm run build
    
    # Salvar domínio atual para evitar recompilação desnecessária
    CURRENT_DOMAIN=$(echo $APP_URL | sed -E 's|^https?://||' | sed 's|/.*||')
    echo "$CURRENT_DOMAIN" > "public/build/.domain"
    
    echo "Assets compilados com sucesso para o domínio: $CURRENT_DOMAIN"
else
    echo "Assets já compilados para o domínio atual."
fi

# Limpar caches (importante para pegar variáveis do EasyPanel)
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "=== APLICAÇÃO PRONTA! INICIANDO APACHE ==="

# Iniciar Apache
exec apache2-foreground
