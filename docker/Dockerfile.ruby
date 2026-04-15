FROM ruby:3.3-slim AS builder

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends build-essential pkg-config && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY apps/ruby-workflow/Gemfile apps/ruby-workflow/Gemfile.lock* ./
RUN bundle config set --local without "development test" && \
    bundle install --jobs 4 --retry 3

FROM ruby:3.3-slim AS runner

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN groupadd --system rubyapp && useradd --system --gid rubyapp rubyapp

COPY --from=builder /usr/local/bundle /usr/local/bundle
COPY apps/ruby-workflow/ .

USER rubyapp
ENV RACK_ENV=production
ENV PORT=4005
EXPOSE 4005

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb", "config.ru"]
