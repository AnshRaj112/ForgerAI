FROM ruby:3.3-slim AS builder

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends build-essential pkg-config libssl-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY apps/ruby-workflow/Gemfile apps/ruby-workflow/Gemfile.lock* ./
RUN bundle config set --local without "development test" && \
    bundle install --jobs 4 --retry 3

FROM ruby:3.3-slim AS runner

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends ca-certificates curl libssl3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN groupadd --system rubyapp && useradd --system --gid rubyapp rubyapp

# Copy the entire bundle from the builder
COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY apps/ruby-workflow/ .

RUN chown -R rubyapp:rubyapp /app

USER rubyapp
ENV RACK_ENV=production
ENV PORT=4005
ENV BUNDLE_APP_CONFIG=/app/.bundle

EXPOSE 4005

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb", "config.ru"]
