FROM ruby:3.3-alpine

WORKDIR /app
RUN apk add --no-cache build-base

COPY apps/ruby-workflow/Gemfile /app/Gemfile
RUN bundle config set without "development test" && bundle install

COPY apps/ruby-workflow /app

ENV PORT=4005
EXPOSE 4005

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
