# ForgeAI — Polyglot AI Agent Forge & Marketplace

<div align="center">

**Build powerful AI agents visually. Automatically compiled into optimized polyglot microservices.**

*Python for AI • Rust for Performance • Go for Orchestration • Java for Enterprise • Ruby for Workflows • PHP for CMS • Node.js for Real-Time*

</div>

---

## 🚀 What is ForgeAI?

ForgeAI is a **no-code / low-code visual platform** where anyone can build powerful AI agents using a drag-and-drop interface. The unique differentiator is the **Polyglot Compilation Engine**: every agent is automatically broken down into optimized microservices, with each node running in the **best programming language** for that specific task.

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Next.js 15 Gateway (:3000)                │
│           UI/UX · Visual Builder · API Gateway               │
└─────────────────────────┬────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │  Go Orchestrator (:4001)│
              │  Temporal · Workflows  │
              └───┬───┬───┬───┬───┬───┘
                  │   │   │   │   │
    ┌─────────────┼───┼───┼───┼───┼──────────────┐
    │             │   │   │   │   │              │
┌───┴───┐  ┌─────┴┐ ┌┴────┐ ┌┴───┐  ┌──────┐ ┌─┴──────────┐
│Python │  │Rust  │ │Java │ │Ruby│  │ PHP  │ │Node Realtime│
│AI     │  │Exec  │ │Ent. │ │WF  │  │ CMS  │ │Socket.IO    │
│:4002  │  │:4003 │ │:4004│ │:4005│  │:4006 │ │:4010        │
└───────┘  └──────┘ └─────┘ └────┘  └──────┘ └─────────────┘
```

### Service Responsibilities

| Service | Language | Port | Responsibility |
|---------|----------|------|----------------|
| `web` | Next.js 15 | 3000 | UI, Visual Builder (React Flow), API Gateway |
| `go-orchestrator` | Go | 4001 | Central Brain — Temporal workflows, coordination |
| `python-ai` | Python | 4002 | LLM/RAG inference, LangChain/LangGraph |
| `rust-executor` | Rust | 4003 | Crypto, WASM runtime, secure execution |
| `java-enterprise` | Java/Spring | 4004 | Compliance, audit, transactions, billing |
| `ruby-workflow` | Ruby/Sinatra | 4005 | Business rules, approval workflows |
| `php-cms` | PHP/Laravel | 4006 | Content generation, templates, e-commerce |
| `node-realtime` | Node.js | 4010 | WebSockets, live monitoring, Socket.IO |

### Infrastructure

- **Database**: MongoDB 8.0 (persistent) + Redis 7 (cache, queues)
- **Messaging**: NATS JetStream (async events) + gRPC (sync calls)
- **Orchestration**: Temporal.io
- **Containerization**: Docker Compose (dev), Kubernetes (prod)

## 📦 Monorepo Structure

```
ForgerAI/
├── apps/
│   ├── web/               # Next.js 15 frontend + API gateway
│   ├── go-orchestrator/   # Go orchestration service
│   ├── python-ai/         # Python AI/LLM service
│   ├── rust-executor/     # Rust high-performance executor
│   ├── java-enterprise/   # Java/Spring Boot enterprise layer
│   ├── ruby-workflow/     # Ruby workflow engine
│   ├── php-cms/           # PHP/Laravel CMS service
│   ├── node-realtime/     # Node.js real-time service
│   └── docs/              # Documentation
├── packages/
│   ├── types/             # Shared TypeScript/Zod schemas
│   ├── proto/             # Protobuf/gRPC definitions
│   ├── config/            # Shared environment config
│   ├── constants/         # Node types, language mappings
│   ├── ui/                # Shared React component library
│   ├── eslint-config/     # Shared ESLint configuration
│   ├── typescript-config/ # Shared TypeScript configuration
│   └── utils/             # Shared utilities
├── docker/
│   ├── compose.yml        # Full Docker Compose stack
│   └── Dockerfile.*       # Per-service Dockerfiles
├── infra/
│   └── kubernetes/        # K8s manifests for production
└── scripts/
    ├── generate-proto.sh  # Protobuf code generation
    └── seed-db.js         # Database seeding script
```

## 🛠 Getting Started

### Prerequisites

- Node.js ≥ 18
- Docker & Docker Compose
- Go 1.24+, Python 3.12+, Rust 1.80+, Java 21+, Ruby 3.3+, PHP 8.3+

### Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/AnshRaj112/ForgerAI.git
cd ForgerAI

# 2. Install dependencies
npm install

# 3. Start infrastructure (MongoDB, Redis, NATS)
docker compose -f docker/compose.yml up mongodb redis nats -d

# 4. Start the Next.js frontend
npx turbo dev --filter=web

# 5. (Optional) Start all services
docker compose -f docker/compose.yml up --build
```

### Development

```bash
# Run all services in dev mode
npx turbo dev

# Build all packages
npx turbo build

# Lint all packages
npx turbo lint

# Type check
npx turbo check-types
```

## 🎨 Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, architecture diagram |
| `/dashboard` | Agent overview, stats, activity feed |
| `/builder` | Visual drag-and-drop agent builder (React Flow) |
| `/marketplace` | Browse, search, and install pre-built agents |
| `/deployments` | Monitor deployed agents across environments |

## 📡 API Gateway Routes

| Endpoint | Method | Target Service |
|----------|--------|---------------|
| `/api/forge/compile` | POST | Go Orchestrator |
| `/api/forge/deploy` | POST | Go Orchestrator |
| `/api/forge/run-agent` | POST | Python AI |
| `/api/forge/status/[jobId]` | GET | Go Orchestrator |
| `/api/forge/manifest` | GET/POST | Internal (MongoDB) |
| `/api/forge/compile-manifest` | POST | Go Orchestrator |

## 📄 License

MIT © ForgeAI
