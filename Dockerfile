# Dockerfile otimizado para EasyPanel - Hotel Manager SaaS
FROM php:8.2-apache

# Labels para EasyPanel
LABEL maintainer="kaiozinho" \
      version="1.0.0" \
      description="Hotel Manager SaaS - Sistema de Gestão Hoteleira Multi-Tenant"

# Variáveis de ambiente
ENV APP_NAME="Hotel Manager SaaS" \
    APP_ENV=production \
    APP_DEBUG=false \
    APP_URL=http://localhost

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libwebp-dev \
    libxpm-dev \
    zip \
    unzip \
    curl \
    git \
    nodejs \
    npm \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Instalar extensões PHP necessárias (separadamente para evitar erros)
RUN docker-php-ext-install pdo_mysql pdo_sqlite zip bcmath ctype fileinfo json mbstring openssl tokenizer xml

# Instalar GD separadamente
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Habilitar módulos Apache
RUN a2enmod rewrite headers expires

# Configurar Apache para Laravel
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|AllowOverride None|AllowOverride All|g' /etc/apache2/sites-available/000-default.conf

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos de configuração primeiro
COPY composer.json composer.lock* ./

# Instalar dependências do PHP
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Copiar resto dos arquivos
COPY --chown=www-data:www-data . .

# Criar banco de dados SQLite
RUN mkdir -p database \
    && touch database/database.sqlite \
    && chmod 666 database/database.sqlite

# Instalar dependências do Node.js e compilar assets
RUN npm install \
    && npm run build \
    && npm cache clean --force

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && chmod -R 755 /var/www/html/public \
    && touch storage/logs/laravel.log \
    && chmod 666 storage/logs/laravel.log

# Criar storage link
RUN php artisan storage:link

# Limpar cache
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Expor porta 80
EXPOSE 80

# Health check para EasyPanel
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Comando de inicialização
CMD ["apache2-foreground"]
