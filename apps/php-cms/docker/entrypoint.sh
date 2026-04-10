#!/bin/sh
set -e
cd /var/www/html

if [ ! -f .env ]; then
  cp .env.example .env
fi

php artisan key:generate --force --no-interaction 2>/dev/null || true
php artisan package:discover --ansi --no-interaction 2>/dev/null || true
php artisan config:clear --no-interaction 2>/dev/null || true

exec php artisan serve --host=0.0.0.0 --port="${PORT:-4006}"
