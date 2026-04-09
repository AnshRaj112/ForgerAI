FROM php:8.3-cli-alpine

WORKDIR /app
COPY apps/php-cms /app

ENV PORT=4006
EXPOSE 4006

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT} -t public public/index.php"]
