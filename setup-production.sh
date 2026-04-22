#!/bin/bash

echo "=== SETUP HOTEL MANAGER - SERVIDOR DE PRODUÇÃO ==="
echo "Servidor com EasyPanel na porta 80 - Usando PM2 na porta 3333"

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "Instalando PM2..."
    npm install -g pm2
fi

# Verificar se PHP está instalado
if ! command -v php &> /dev/null; then
    echo "ERRO: PHP não está instalado."
    echo "Instale PHP com: sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-zip php8.2-bcmath php8.2-ctype php8.2-fileinfo php8.2-mbstring php8.2-xml"
    exit 1
fi

# Verificar se Composer está instalado
if ! command -v composer &> /dev/null; then
    echo "ERRO: Composer não está instalado."
    echo "Instale Composer com: curl -sS https://getcomposer.org/installer | php"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não está instalado."
    echo "Instale Node.js com: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    exit 1
fi

echo "Instalando dependências PHP..."
composer install --optimize-autoloader --no-dev --no-interaction

echo "Instalando dependências Node.js..."
npm install

echo "Compilando assets..."
npm run build

echo "Configurando ambiente de produção..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  ARQUIVO .env CRIADO! Configure suas credenciais:"
    echo "   - DB_CONNECTION=mysql"
    echo "   - DB_HOST=127.0.0.1 ou localhost"
    echo "   - DB_PORT=3306"
    echo "   - DB_DATABASE=hotel_manager"
    echo "   - DB_USERNAME=seu_usuario_mysql"
    echo "   - DB_PASSWORD=sua_senha_mysql"
    echo "   - APP_URL=https://exchange.replayzone.com.br"
    echo ""
    echo "Pressione ENTER para continuar após configurar .env"
    read -p ""
fi

echo "Verificando configuração do banco..."
if php artisan migrate:status > /dev/null 2>&1; then
    echo "Banco conectado. Verificando migrations pendentes..."
    
    PENDING_COUNT=$(php artisan migrate:status 2>/dev/null | grep -c "Pending" || echo "0")
    
    if [ "$PENDING_COUNT" -gt 0 ]; then
        echo "Aplicando $PENDING_COUNT migrations pendentes..."
        php artisan migrate --force
    else
        echo "Nenhuma migration pendente."
    fi
else
    echo "Configurando banco inicial..."
    php artisan migrate --force
    php artisan db:seed --force
    echo "Banco configurado com sucesso!"
fi

echo "Criando storage link..."
php artisan storage:link

echo "Limpando caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Iniciando aplicação com PM2 na porta 3333..."
pm2 start ecosystem-production.js

echo "Salvando configuração PM2..."
pm2 save

echo "Configurando PM2 para iniciar com o sistema..."
pm2 startup

echo ""
echo "=== SETUP CONCLUÍDO! ==="
echo "🚀 Aplicação rodando em: http://localhost:3333"
echo "🌐 Acesso externo: https://exchange.replayzone.com.br"
echo "📊 Painel PM2: pm2 status"
echo "📝 Logs: pm2 logs hotel-manager-laravel"
echo ""
echo "⚠️  IMPORTANTE: Configure o proxy/reverso no EasyPanel:"
echo "   - Tipo: HTTP"
echo "   - Porta Interna: 3333"
echo "   - Domínio: exchange.replayzone.com.br"
echo "   - SSL: Ativar"
echo ""
echo "🔧 Comandos úteis:"
echo "   pm2 status                    - Ver status"
echo "   pm2 restart hotel-manager-laravel - Reiniciar aplicação"
echo "   pm2 logs hotel-manager-laravel  - Ver logs"
echo "   pm2 stop hotel-manager-laravel   - Parar aplicação"
