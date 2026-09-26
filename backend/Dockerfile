FROM php:8.2-cli-alpine

# Install system dependencies & PHP extensions
RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    git \
    oniguruma-dev \
    libxml2-dev

RUN docker-php-ext-install pdo pdo_sqlite mbstring bcmath gd zip xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files and install PHP packages
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy full application code
COPY . .

# Ensure storage & database directories exist with proper write permissions
RUN mkdir -p storage/framework/views storage/framework/sessions storage/framework/cache/data database \
    && chmod -R 777 storage bootstrap/cache database

# Create SQLite DB if missing
RUN touch database/database.sqlite && chmod 777 database/database.sqlite

# Run composer post-autoload-dump
RUN composer dump-autoload --optimize

ENV PORT=8000
# Force file-based cache & sessions so no DB cache table is required on cold start
ENV CACHE_STORE=file
ENV SESSION_DRIVER=file

EXPOSE 8000

# Startup: generate app key if missing, run DB migrations, cache config, then serve
CMD ["sh", "-c", "php artisan key:generate --force && php artisan migrate --force && php artisan config:cache && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]
