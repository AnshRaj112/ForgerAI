FROM composer:2 AS vendor
WORKDIR /app
COPY apps/php-cms/composer.json apps/php-cms/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --ignore-platform-req=ext-mongodb

FROM php:8.4-cli-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl-dev pkg-config zlib1g-dev \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html
COPY apps/php-cms/ .
COPY --from=vendor /app/vendor ./vendor

# Generate optimized autoloader now that source is present
COPY --from=vendor /usr/bin/composer /usr/bin/composer
RUN composer dump-autoload --optimize --no-dev --ignore-platform-req=ext-mongodb --ignore-platform-req=php

RUN php artisan package:discover --no-ansi

ENV APP_ENV=production
ENV APP_DEBUG=false
EXPOSE 4006

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=4006"]
