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

# Instalar dependências do sistema (mínimo necessário)
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

# Instalar extensões PHP essenciais (sem tokenizer que causa erro)
RUN docker-php-ext-install pdo_mysql pdo_sqlite zip bcmath ctype fileinfo mbstring xml

# Instalar GD (sem webp para evitar conflitos)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar ServerName para evitar warnings
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Habilitar módulos Apache
RUN a2enmod rewrite headers expires

# Configurar Apache para Laravel
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|AllowOverride None|AllowOverride All|g' /etc/apache2/sites-available/000-default.conf

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos do projeto
COPY --chown=www-data:www-data . .

# Configurar permissões essenciais (após copiar arquivos)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache \
    && touch /var/www/html/storage/logs/laravel.log \
    && chmod 666 /var/www/html/storage/logs/laravel.log

# Instalar dependências do PHP
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Instalar dependências do Node.js
RUN npm install

# Compilar assets para produção
RUN npm run build

# Criar storage link
RUN php artisan storage:link

# Limpar cache
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Expor porta 80
EXPOSE 80


# Script de inicialização 100% EasyPanel (usa apenas variáveis de ambiente)
COPY docker/startup-easypanel.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# Comando de inicialização
CMD ["/usr/local/bin/startup.sh"]
