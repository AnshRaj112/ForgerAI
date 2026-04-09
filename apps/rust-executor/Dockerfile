FROM rust:1.89-alpine AS builder

WORKDIR /src
RUN apk add --no-cache musl-dev

COPY apps/rust-executor/Cargo.toml apps/rust-executor/Cargo.lock ./
RUN mkdir -p src && echo "fn main() {}" > src/main.rs && cargo build --release && rm -rf src

COPY apps/rust-executor/src ./src
RUN cargo build --release

FROM alpine:3.20
RUN adduser -D -H -s /sbin/nologin appuser
USER appuser
WORKDIR /app

COPY --from=builder /src/target/release/rust-executor /app/rust-executor

EXPOSE 4003
ENTRYPOINT ["/app/rust-executor"]
