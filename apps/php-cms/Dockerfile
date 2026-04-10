# Build from monorepo root: docker build -f apps/php-cms/Dockerfile .
FROM composer:2 AS vendor
ENV COMPOSER_PROCESS_TIMEOUT=0
WORKDIR /app
COPY apps/php-cms/composer.json apps/php-cms/composer.lock* ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts \
    --ignore-platform-req=ext-mongodb

FROM php:8.3-cli-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libssl-dev \
    pkg-config \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --from=vendor /app/vendor ./vendor
COPY apps/php-cms/ .

RUN chmod +x docker/entrypoint.sh \
    && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache

ENV PORT=4006
EXPOSE 4006

ENTRYPOINT ["./docker/entrypoint.sh"]
