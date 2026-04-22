#!/bin/bash

echo "=== SETUP HOTEL MANAGER COM PM2 ==="

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "Instalando PM2..."
    npm install -g pm2
fi

# Verificar se PHP está instalado
if ! command -v php &> /dev/null; then
    echo "ERRO: PHP não está instalado. Instale PHP primeiro."
    exit 1
fi

# Verificar se Composer está instalado
if ! command -v composer &> /dev/null; then
    echo "ERRO: Composer não está instalado. Instale Composer primeiro."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não está instalado. Instale Node.js primeiro."
    exit 1
fi

echo "Instalando dependências PHP..."
composer install --optimize-autoloader --no-dev

echo "Instalando dependências Node.js..."
npm install

echo "Compilando assets..."
npm run build

echo "Configurando ambiente..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Arquivo .env criado. Configure suas variáveis de ambiente."
fi

echo "Gerando APP_KEY..."
php artisan key:generate

echo "Executando migrations..."
php artisan migrate --force

echo "Executando seeders..."
php artisan db:seed --force

echo "Criando storage link..."
php artisan storage:link

echo "Limpando caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js

echo "Salvando configuração PM2..."
pm2 save

echo "Configurando PM2 para iniciar com o sistema..."
pm2 startup

echo "=== SETUP CONCLUÍDO ==="
echo "Aplicação rodando em: http://localhost:3000"
echo "Para EasyPanel: Configure proxy reverso para porta 3000"
echo "Para verificar status: pm2 status"
echo "Para ver logs: pm2 logs"
echo "Para parar: pm2 stop hotel-manager-laravel"
echo "Para reiniciar: pm2 restart hotel-manager-laravel"
