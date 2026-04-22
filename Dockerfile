FROM php:8.2-apache

# Labels para identificação
LABEL maintainer="Hotel Manager SaaS" \
      version="1.0.0" \
      description="Hotel Manager SaaS - Sistema de Gestão Hoteleira Multi-Tenant"

# Variáveis de ambiente padrão
ENV APP_NAME="Hotel Manager SaaS" \
    APP_ENV=local \
    APP_DEBUG=true \
    APP_URL=http://localhost:8000

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
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

# Instalar extensões PHP
RUN docker-php-ext-install pdo_mysql pdo_sqlite zip bcmath ctype fileinfo mbstring xml

# Instalar GD
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && a2enmod rewrite headers expires \
    && sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|AllowOverride None|AllowOverride All|g' /etc/apache2/sites-available/000-default.conf

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos do projeto
COPY . .

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache \
    && touch /var/www/html/storage/logs/laravel.log \
    && chmod 666 /var/www/html/storage/logs/laravel.log

# Instalar dependências PHP
RUN composer install --optimize-autoloader --no-interaction

# Instalar dependências Node.js e compilar assets
RUN npm install \
    && npm run build \
    && npm cache clean --force

# Criar storage link
RUN php artisan storage:link

# Limpar cache
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# Expor porta 80
EXPOSE 80

# Script de inicialização
COPY docker/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# Comando de inicialização
CMD ["/usr/local/bin/startup.sh"]
