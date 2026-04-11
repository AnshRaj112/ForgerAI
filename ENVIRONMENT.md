# ForgeAI — Environment Variables Guide

> Complete reference for every environment variable used across the ForgeAI platform.
> Copy `.env.example` → `.env` at project root and fill in your values.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Next.js Web Gateway](#1-nextjs-web-gateway)
- [Go Orchestrator](#2-go-orchestrator)
- [Python AI Service](#3-python-ai-service)
- [Rust Executor](#4-rust-executor)
- [Java Enterprise](#5-java-enterprise)
- [Ruby Workflow](#6-ruby-workflow)
- [PHP CMS](#7-php-cms)
- [Node.js Realtime](#8-nodejs-realtime)
- [Infrastructure](#9-infrastructure)
- [Future: Authentication](#10-future-authentication)

---

## Quick Start

```bash
# 1. Copy the env template
cp .env.example .env

# 2. Generate required secrets
#    - PHP APP_KEY: Run inside apps/php-cms → php artisan key:generate
#    - Or generate a random 32-char base64: openssl rand -base64 32

# 3. Add your LLM API key (at least one is required for AI features)
#    - OpenAI: https://platform.openai.com/api-keys
#    - Groq:   https://console.groq.com/keys

# 4. Start infrastructure
docker compose -f docker/compose.yml up mongodb redis nats temporal -d

# 5. Start the web app
npx turbo dev --filter=web
```

---

## 1. Next.js Web Gateway

> Service: `apps/web` • Port: `3000` • Config: `apps/web/lib/env.ts`

| Variable | Required | Default | How to Get |
|----------|----------|---------|------------|
| `NEXT_PUBLIC_APP_URL` | ✅ | `http://localhost:3000` | Your app's public URL. Use `http://localhost:3000` for local dev. In production, set to your domain (e.g. `https://forgeai.app`). |
| `NEXT_PUBLIC_REALTIME_URL` | ✅ | `http://localhost:4010` | URL of the Node.js realtime service. Use the default for local dev. |
| `NEXT_PUBLIC_REALTIME_SOCKET_PATH` | No | `/socket` | Socket.IO path. Must match `FORGE_SOCKET_PATH` in the Node.js realtime service. |
| `FORGE_REALTIME_EVENT_URL` | ✅ | `http://localhost:4010/events` | Server-side URL for pushing events to the realtime service. |
| `FORGE_GO_ORCHESTRATOR_URL` | ✅ | `http://localhost:4001` | URL of the Go orchestrator. Use `http://go-orchestrator:4001` inside Docker. |
| `FORGE_PYTHON_AI_URL` | ✅ | `http://localhost:4002` | URL of the Python AI service. Use `http://python-ai:4002` inside Docker. |
| `FORGE_RUST_EXECUTOR_URL` | ✅ | `http://localhost:4003` | URL of the Rust executor. Use `http://rust-executor:4003` inside Docker. |
| `FORGE_JAVA_ENTERPRISE_URL` | ✅ | `http://localhost:4004` | URL of the Java enterprise service. Use `http://java-enterprise:4004` inside Docker. |
| `FORGE_JAVA_ENTERPRISE_TOKEN` | No | — | JWT Bearer token for authenticated calls to the Java service. Obtain by calling `POST http://localhost:4004/api/auth/login` with `{"username":"enterprise","password":"enterprise"}` (dev credentials). |
| `FORGE_RUBY_WORKFLOW_URL` | ✅ | `http://localhost:4005` | URL of the Ruby workflow engine. Use `http://ruby-workflow:4005` inside Docker. |
| `FORGE_PHP_CMS_URL` | ✅ | `http://localhost:4006` | URL of the PHP CMS service. Use `http://php-cms:4006` inside Docker. |
| `NODE_ENV` | No | `development` | Set to `production` for production builds. |

---

## 2. Go Orchestrator

> Service: `apps/go-orchestrator` • Port: `4001` (HTTP), `50051` (gRPC) • Config: `internal/config/config.go`

| Variable | Required | Default | How to Get |
|----------|----------|---------|------------|
| `SERVICE_NAME` | No | `go-orchestrator` | Service identifier for logs/tracing. |
| `PORT` | No | `4001` | HTTP port. Change only if port conflicts exist. |
| `GRPC_PORT` | No | `50051` | gRPC port for inter-service communication. Must be exposed in Docker if using gRPC. |
| `FORGE_DATABASE_URL` | ✅ | `mongodb://localhost:27017` | MongoDB connection string. Use `mongodb://forgeai:forgeai@mongodb:27017/forgeai?authSource=admin&replicaSet=rs0` inside Docker. For local dev, start MongoDB with `mongod --replSet rs0` and run `rs.initiate()` in mongosh. |
| `FORGE_DATABASE_NAME` | No | `forgeai` | MongoDB database name. |
| `FORGE_NATS_URL` | ✅ | `nats://localhost:4222` | NATS server URL. Use `nats://nats:4222` inside Docker. Start locally with `docker run -p 4222:4222 nats:2.10-alpine -js`. |
| `TEMPORAL_HOST_PORT` | ✅ | `localhost:7233` | Temporal server address. **The Go orchestrator will crash without Temporal running.** See [Infrastructure](#9-infrastructure) for setup. |
| `TEMPORAL_NAMESPACE` | No | `default` | Temporal namespace. Use `default` unless you've configured a custom one. |
| `TEMPORAL_TASK_QUEUE` | No | `forgeai-orchestrator` | Temporal task queue name. Must be consistent across orchestrator and workers. |
| `SHUTDOWN_TIMEOUT` | No | `15s` | Graceful shutdown timeout as a Go duration (e.g. `15s`, `30s`, `1m`). |

---

## 3. Python AI Service

> Service: `apps/python-ai` • Port: `4002` • Config: `app/core/config.py`

| Variable | Required | Default | How to Get |
|----------|----------|---------|------------|
| `SERVICE_NAME` | No | `python-ai` | Service identifier. |
| `PORT` | No | `4002` | HTTP port. |
| `APP_ENV` | No | `development` | Set to `production` in prod. |
| `LLM_PROVIDER` | No | `groq` | Which LLM provider to use. Only `groq` is supported. |
| `GROQ_API_KEY` | ⚠️ | — | **Required.** Get from [Groq Console → API Keys](https://console.groq.com/keys). Free tier available with rate limits. |
| `GROQ_MODEL` | No | `llama-3.1-8b-instant` | Groq model to use. Options: `llama-3.1-8b-instant`, `llama-3.1-70b-versatile`, `mixtral-8x7b-32768`. See [Groq Models](https://console.groq.com/docs/models). |
| `DEFAULT_TEMPERATURE` | No | `0.2` | LLM temperature (0.0 = deterministic, 1.0 = creative). Range: `0.0` – `2.0`. |
| `FORGE_NATS_URL` | ✅ | `nats://localhost:4222` | NATS server URL. |
| `NATS_SUBJECT_AGENT_RUN` | No | `forge.agent.run` | NATS subject for incoming agent execution requests. |
| `NATS_SUBJECT_AGENT_RESULT` | No | `forge.agent.result` | NATS subject for publishing agent execution results. |

### How to get an LLM API Key

**Groq (faster inference):**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up
3. Navigate to **API Keys**
4. Click **"Create API Key"**
5. Copy the key (starts with `gsk_...`)
6. Set `GROQ_API_KEY=gsk_...` and `LLM_PROVIDER=groq` in your `.env`

---

## 4. Rust Executor

> Service: `apps/rust-executor` • Port: `4003` • Config: `src/config.rs`

| Variable | Required | Default | How to Get |
|----------|----------|---------|------------|
| `SERVICE_NAME` | No | `rust-executor` | Service identifier. |
| `PORT` | No | `4003` | HTTP port. |
| `FORGE_DATABASE_URL` | ✅ | `mongodb://localhost:27017` | MongoDB connection string. |
| `FORGE_DATABASE_NAME` | No | `forgeai` | MongoDB database name. |
| `FORGE_REDIS_URL` | ✅ | `redis://localhost:6379` | Redis connection URL. |
| `FORGE_CRYPTO_HMAC_SECRET` | ✅ | `dev-secret` | HMAC secret for cryptographic operations. **Generate a strong random secret for production.** Run: `openssl rand -hex 32` |
| `RUST_LOG` | No | `rust_executor=debug,axum=info` | Rust tracing filter. See [tracing-subscriber docs](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html). Examples: `info`, `rust_executor=trace`, `warn`. |

### How to generate `FORGE_CRYPTO_HMAC_SECRET`

```bash
# Linux / macOS / Git Bash on Windows
openssl rand -hex 32
# Output: a1b2c3d4e5f6... (64 hex chars = 256-bit key)

# PowerShell (Windows)
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 5. Java Enterprise

> Service: `apps/java-enterprise` • Port: `4004` • Config: `src/main/resources/application*.yml`

| Variable | Required | Default | How to Get |
|----------|----------|---------|------------|
| `SPRING_PROFILES_ACTIVE` | No | `dev` | Spring Boot profile. Options: `dev`, `prod`. Use `dev` for local development (permissive CORS, bootstrap users). |
| `PORT` | No | `4004` | HTTP server port. |
| `FORGE_DATABASE_URL` | ✅ | `mongodb://localhost:27017/forgeai` | MongoDB connection string. |
| `FORGE_DATABASE_NAME` | No | `forgeai` | MongoDB database name. |
| `ENTERPRISE_JWT_SECRET` | ✅ | `dev-enterprise-jwt-secret-min-32-chars!!` | HS256 JWT signing secret. **Must be at least 32 characters.** Replace in any shared/production environment. Generate with: `openssl rand -base64 48` |
| `ENTERPRISE_JWT_EXPIRATION_MS` | No | `86400000` | JWT token expiry in milliseconds. Default is 24 hours. Set to `43200000` for 12 hours, `3600000` for 1 hour. |
| `ENTERPRISE_INTEGRATION_MODE` | No | `stub` | Enterprise integration mode. Options: `stub` (mock), `live` (real integrations). |
| `ENTERPRISE_COMPLIANCE_PROVIDER` | No | `default` | Compliance check provider. |
| `ENTERPRISE_AUDIT_TOPIC` | No | `forge.enterprise.audit` | NATS topic for audit log events. |
| `ENTERPRISE_CORS_ORIGIN` | No | `http://localhost:3000` | Allowed CORS origin. Set to your frontend URL. |

### Dev bootstrap credentials

When `SPRING_PROFILES_ACTIVE=dev`, the service auto-creates a user:
- **Username:** `enterprise`
- **Password:** `enterprise`
- **Roles:** `ENTERPRISE_ADMIN`, `ENTERPRISE_USER`

Login via: `POST http://localhost:4004/api/auth/login` with body `{"username":"enterprise","password":"enterprise"}`

### How to generate `ENTERPRISE_JWT_SECRET`

```bash
# Must be at least 32 characters (256 bits for HS256)
openssl rand -base64 48
# Output: xK7mN2pQ9rS4vW6... (64 base64 chars = 384-bit key)
```

---

## 6. Ruby Workflow

> Service: `apps/ruby-workflow` • Port: `4005` • Config: `lib/settings.rb`, `config/puma.rb`

| Variable | Required | Default | How to Get |
|----------|----------|---------|------------|
| `PORT` | No | `4005` | HTTP port (Puma). |
| `RACK_ENV` | No | `development` | Rack environment. Options: `development`, `production`, `test`. |
| `PUMA_WORKERS` | No | `1` | Number of Puma worker processes. Set to CPU count in production. |
| `PUMA_THREADS_MIN` | No | `2` | Minimum threads per worker. |
| `PUMA_THREADS_MAX` | No | `8` | Maximum threads per worker. |
| `FORGE_DATABASE_URL` | ✅ | `mongodb://127.0.0.1:27017/forgeai` | MongoDB connection string. |
| `FORGE_REDIS_URL` | ✅ | `redis://127.0.0.1:6379` | Redis connection URL. |
| `FORGE_NATS_URL` | ✅ | `nats://127.0.0.1:4222` | NATS server URL. |
| `FORGE_NATS_WORKFLOW_SUBJECT` | No | `forge.>` | NATS subject pattern to subscribe to for workflow events. |
| `FORGE_CORS_ORIGINS` | No | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated allowed CORS origins. |
| `FORGE_WORKFLOW_QUEUE_KEY` | No | `forge:workflow:queue` | Redis key for the workflow job queue. |

---

## 7. PHP CMS

> Service: `apps/php-cms` • Port: `4006` • Config: `config/*.php`, `.env`

| Variable | Required | Default | How to Get |
|----------|----------|---------|------------|
| `APP_NAME` | No | `ForgeAI PHP CMS` | Application name for logs/display. |
| `APP_ENV` | No | `local` | Laravel environment. Options: `local`, `production`, `testing`. |
| `APP_KEY` | ✅ | — | **Required! Laravel won't boot without it.** See generation instructions below. |
| `APP_DEBUG` | No | `true` | Set to `false` in production. Shows detailed error pages when `true`. |
| `APP_URL` | No | `http://localhost:4006` | Public URL of the CMS service. |
| `PORT` | No | `4006` | HTTP port. |
| `LOG_CHANNEL` | No | `stack` | Laravel log channel. Options: `stack`, `single`, `daily`, `stderr`. |
| `LOG_LEVEL` | No | `debug` | Minimum log level. Options: `debug`, `info`, `notice`, `warning`, `error`. |
| `DB_CONNECTION` | No | `mongodb` | Database driver. Keep as `mongodb`. |
| `FORGE_DATABASE_URL` | ✅ | `mongodb://127.0.0.1:27017/forgeai` | MongoDB connection string. |
| `MONGODB_DATABASE` | No | `forgeai` | MongoDB database name. |
| `FORGE_REDIS_URL` | ✅ | — | Redis connection URL. |
| `REDIS_CLIENT` | No | `predis` | Redis client library. Options: `predis`, `phpredis`. |
| `REDIS_HOST` | No | `127.0.0.1` | Redis host (fallback if `FORGE_REDIS_URL` not set). |
| `REDIS_PORT` | No | `6379` | Redis port (fallback). |
| `REDIS_PASSWORD` | No | `null` | Redis password if your instance requires auth. |
| `CACHE_STORE` | No | `redis` | Cache backend. Options: `redis`, `file`, `database`, `array`. |
| `SESSION_DRIVER` | No | `file` | Session storage. Options: `file`, `redis`, `database`, `cookie`. |
| `QUEUE_CONNECTION` | No | `sync` | Queue driver. Options: `sync` (inline), `redis`, `database`. |
| `FORGE_CORS_ORIGINS` | No | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated allowed CORS origins. |

### How to generate `APP_KEY`

```bash
# Option 1: Using Laravel artisan (if PHP is installed)
cd apps/php-cms
php artisan key:generate
# This auto-fills APP_KEY in apps/php-cms/.env

# Option 2: Using OpenSSL
echo "base64:$(openssl rand -base64 32)"
# Output: base64:xK7mN2pQ9rS4vW6yA8bC1dE3fG5hI7jK9lM0nO2pQ4=

# Option 3: Using Node.js
node -e "console.log('base64:' + require('crypto').randomBytes(32).toString('base64'))"

# Option 4: Using PowerShell (Windows)
$bytes = New-Object byte[] 32; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); "base64:$([Convert]::ToBase64String($bytes))"
```

> **Important:** The `APP_KEY` value must be prefixed with `base64:` followed by a 32-byte base64-encoded string.

---

## 8. Node.js Realtime

> Service: `apps/node-realtime` • Port: `4010` • Config: `src/config.js`, `src/logger.js`

| Variable | Required | Default | How to Get |
|----------|----------|---------|------------|
| `PORT` | No | `4010` | HTTP/WebSocket port. |
| `LOG_LEVEL` | No | `info` | Logging verbosity. Options: `error`, `warn`, `info`, `debug`, `trace`. |
| `FORGE_DATABASE_URL` | ✅ | `mongodb://127.0.0.1:27017/forgeai` | MongoDB connection string. |
| `FORGE_REDIS_URL` | ✅ | `redis://127.0.0.1:6379` | Redis URL (used by BullMQ for job queues). |
| `FORGE_NATS_URL` | ✅ | `nats://127.0.0.1:4222` | NATS server URL. |
| `FORGE_CORS_ORIGINS` | No | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated allowed CORS origins for Socket.IO. |
| `FORGE_SOCKET_PATH` | No | `/socket` | Socket.IO server path. Must match `NEXT_PUBLIC_REALTIME_SOCKET_PATH` on the web client. |
| `FORGE_NATS_STREAM` | No | `FORGE` | JetStream stream name. |
| `FORGE_NATS_CONSUMER_SUBJECT` | No | `forge.>` | JetStream filter subject for messages to bridge to WebSocket clients. |
| `FORGE_NATS_DURABLE` | No | `node-realtime-bridge` | JetStream durable consumer name (survives restarts). |
| `FORGE_QUEUE_NAME` | No | `forge-realtime-events` | BullMQ queue name for realtime event processing. |
| `FORGE_REALTIME_COLLECTION` | No | `realtime_events` | MongoDB collection name for persisting realtime events. |

---

## 9. Infrastructure

### MongoDB

> Image: `mongo:8` • Port: `27017`

```bash
# Run locally via Docker
docker run -d --name forgeai-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=forgeai \
  -e MONGO_INITDB_ROOT_PASSWORD=forgeai \
  -e MONGO_INITDB_DATABASE=forgeai \
  mongo:8 --replSet rs0 --bind_ip_all

# Initialize replica set (required for transactions)
docker exec -it forgeai-mongodb mongosh -u forgeai -p forgeai --authenticationDatabase admin --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'localhost:27017'}]})"
```

Connection string: `mongodb://forgeai:forgeai@localhost:27017/forgeai?authSource=admin&replicaSet=rs0`

| Variable | Value |
|----------|-------|
| `MONGO_INITDB_ROOT_USERNAME` | `forgeai` |
| `MONGO_INITDB_ROOT_PASSWORD` | `forgeai` |
| `MONGO_INITDB_DATABASE` | `forgeai` |

---

### Redis

> Image: `redis:7-alpine` • Port: `6379`

```bash
# Run locally via Docker
docker run -d --name forgeai-redis \
  -p 6379:6379 \
  redis:7-alpine redis-server --appendonly yes
```

Connection URL: `redis://localhost:6379`

No authentication required for local dev. For production, set:

| Variable | Value |
|----------|-------|
| `REDIS_PASSWORD` | Your Redis password |
| `FORGE_REDIS_URL` | `redis://:yourpassword@host:6379` |

---

### NATS JetStream

> Image: `nats:2.10-alpine` • Ports: `4222` (client), `8222` (monitoring)

```bash
# Run locally via Docker
docker run -d --name forgeai-nats \
  -p 4222:4222 -p 8222:8222 \
  nats:2.10-alpine -js -m 8222

# Verify it's running
curl http://localhost:8222/healthz
```

Connection URL: `nats://localhost:4222`
Monitoring dashboard: `http://localhost:8222`

---

### Temporal

> Image: `temporalio/auto-setup:latest` • Port: `7233` (gRPC), `8233` (Web UI)

**The Go Orchestrator requires Temporal to be running.** Without it, the orchestrator will fail to start.

```bash
# Run locally via Docker
docker run -d --name forgeai-temporal \
  -p 7233:7233 -p 8233:8233 \
  -e DB=sqlite \
  -e DYNAMIC_CONFIG_FILE_PATH=config/dynamicconfig/development-sql.yaml \
  temporalio/auto-setup:latest

# Verify it's running
curl http://localhost:7233 2>&1 | head -5
```

Temporal Web UI: `http://localhost:8233`

| Variable | Value |
|----------|-------|
| `TEMPORAL_HOST_PORT` | `localhost:7233` (local) or `temporal:7233` (Docker) |
| `TEMPORAL_NAMESPACE` | `default` |
| `TEMPORAL_TASK_QUEUE` | `forgeai-orchestrator` |

---

## 10. Authentication Reference

> ForgeAI uses a classical Email/Password authentication system to maximize platform independence.

- **Passwords are hashed exclusively using Argon2** (specifically `argon2id` representation) following modern standard practices.
- The **Java Enterprise** service handles token issuance (JWT) during standard logins.
- The **PHP CMS** natively uses Argon2 hashing via Laravel's built-in `argon2id` driver for its core models.

---

## Full `.env` Template

Copy this entire block into your `.env` file:

```env
# ═══════════════════════════════════════════════════════════════
# ForgeAI — Complete Environment Configuration
# Generated from ENVIRONMENT.md
# ═══════════════════════════════════════════════════════════════

# ─── App ───
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_REALTIME_URL=http://localhost:4010
NEXT_PUBLIC_REALTIME_SOCKET_PATH=/socket

# ─── Service URLs (internal, server-side only) ───
FORGE_REALTIME_EVENT_URL=http://localhost:4010/events
FORGE_GO_ORCHESTRATOR_URL=http://localhost:4001
FORGE_PYTHON_AI_URL=http://localhost:4002
FORGE_RUST_EXECUTOR_URL=http://localhost:4003
FORGE_JAVA_ENTERPRISE_URL=http://localhost:4004
FORGE_JAVA_ENTERPRISE_TOKEN=
FORGE_RUBY_WORKFLOW_URL=http://localhost:4005
FORGE_PHP_CMS_URL=http://localhost:4006

# ─── Database ───
FORGE_DATABASE_URL=mongodb://forgeai:forgeai@localhost:27017/forgeai?authSource=admin&replicaSet=rs0
FORGE_DATABASE_NAME=forgeai
FORGE_REDIS_URL=redis://localhost:6379
FORGE_NATS_URL=nats://localhost:4222

# ─── Temporal (required by Go Orchestrator) ───
TEMPORAL_HOST_PORT=localhost:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=forgeai-orchestrator

# ─── Go Orchestrator ───
# PORT=4001
# GRPC_PORT=50051
# SERVICE_NAME=go-orchestrator
# SHUTDOWN_TIMEOUT=15s

# ─── Python AI ───
LLM_PROVIDER=groq
GROQ_API_KEY=gsk-PASTE-YOUR-KEY-HERE
GROQ_MODEL=llama-3.1-8b-instant
DEFAULT_TEMPERATURE=0.2
# NATS_SUBJECT_AGENT_RUN=forge.agent.run
# NATS_SUBJECT_AGENT_RESULT=forge.agent.result

# ─── Rust Executor ───
FORGE_CRYPTO_HMAC_SECRET=change-me-run-openssl-rand-hex-32
RUST_LOG=rust_executor=debug,axum=info

# ─── Java Enterprise ───
SPRING_PROFILES_ACTIVE=dev
ENTERPRISE_JWT_SECRET=change-me-run-openssl-rand-base64-48-min-32-chars
ENTERPRISE_JWT_EXPIRATION_MS=86400000
# ENTERPRISE_INTEGRATION_MODE=stub
# ENTERPRISE_COMPLIANCE_PROVIDER=default
# ENTERPRISE_AUDIT_TOPIC=forge.enterprise.audit
# ENTERPRISE_CORS_ORIGIN=http://localhost:3000

# ─── Ruby Workflow ───
# RACK_ENV=development
# PUMA_WORKERS=1
# PUMA_THREADS_MIN=2
# PUMA_THREADS_MAX=8
# FORGE_NATS_WORKFLOW_SUBJECT=forge.>
# FORGE_WORKFLOW_QUEUE_KEY=forge:workflow:queue

# ─── PHP CMS ───
APP_NAME=ForgeAI PHP CMS
APP_ENV=local
APP_KEY=base64:GENERATE-WITH-openssl-rand-base64-32
APP_DEBUG=true
APP_URL=http://localhost:4006
# DB_CONNECTION=mongodb
# MONGODB_DATABASE=forgeai
# REDIS_CLIENT=predis
# CACHE_STORE=redis
# SESSION_DRIVER=file
# QUEUE_CONNECTION=sync

# ─── Node.js Realtime ───
# LOG_LEVEL=info
# FORGE_SOCKET_PATH=/socket
# FORGE_NATS_STREAM=FORGE
# FORGE_NATS_CONSUMER_SUBJECT=forge.>
# FORGE_NATS_DURABLE=node-realtime-bridge
# FORGE_QUEUE_NAME=forge-realtime-events
# FORGE_REALTIME_COLLECTION=realtime_events

# ─── CORS (shared by Ruby, PHP, Node) ───
FORGE_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

> **Lines starting with `#` are optional** — they have sensible defaults. Uncomment and change only if needed.
> 
> **Lines without `#` are required** — fill in the actual values before running.
