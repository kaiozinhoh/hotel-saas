#!/bin/bash

echo "=== VERIFICAÇÃO AUTOMÁTICA DO BANCO ==="

# Verificar se a tabela migrations existe
TABLE_EXISTS=$(php artisan tinker --execute="
try {
    \Schema::hasTable('migrations');
    echo 'true';
} catch(\Exception \$e) {
    echo 'false';
}
" 2>/dev/null | tr -d '\r\n')

echo "Tabela migrations existe: $TABLE_EXISTS"

if [ "$TABLE_EXISTS" = "false" ]; then
    echo "Banco de dados não configurado. Executando migrate e seed..."
    
    # Criar .env se não existir
    if [ ! -f .env ]; then
        echo "Criando arquivo .env..."
        cat > .env << 'EOF'
APP_NAME="Exchange Hotel"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://www.exchangesistemas.com.br/demo-hotel
APP_KEY=base64:hqUlRmDKFXK8nJDvwF/iGS44ZXXdpQMLuRN+UqJOuWo=
DB_CONNECTION=mysql
DB_HOST=172.17.0.1:5174
DB_PORT=3305
DB_DATABASE=exchange-hotel
DB_USERNAME=root
DB_PASSWORD=Kaio@3005
EOF
    fi
    
    # Executar migrate e seed
    php artisan migrate --force
    php artisan db:seed --force
    
    echo "Banco configurado com sucesso!"
else
    echo "Banco já configurado. Verificando migrations pendentes..."
    
    # Verificar se há migrations pendentes
    PENDING=$(php artisan migrate:status 2>/dev/null | grep -c "Pending" || echo "0")
    
    if [ "$PENDING" -gt 0 ]; then
        echo "Executando $PENDING migrations pendentes..."
        php artisan migrate --force
    else
        echo "Nenhuma migration pendente."
    fi
fi

# Limpar cache
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "=== CONFIGURAÇÃO DO BANCO CONCLUÍDA ==="
