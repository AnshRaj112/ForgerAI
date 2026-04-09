# ForgeAI Proto Package

This package holds shared gRPC protobuf contracts and generation helpers.

## Files

- `common.proto` - shared enums and metadata
- `agent.proto` - `AgentExecutorService` with:
  - `ExecuteAgent`
  - `ExecuteStep`

## Generate Clients

Run from repo root:

```bash
npm run generate --workspace @forgerai/proto
```

Or per language:

```bash
npm run generate:go --workspace @forgerai/proto
npm run generate:python --workspace @forgerai/proto
npm run generate:rust --workspace @forgerai/proto
```

Generated output is written to:

- `packages/proto/generated/go`
- `packages/proto/generated/python`
- `packages/proto/generated/rust`

## Tooling Prerequisites

- `protoc`
- Go plugins:
  - `protoc-gen-go`
  - `protoc-gen-go-grpc`
- Python plugin:
  - `grpcio-tools` (`python -m grpc_tools.protoc`)
- Rust plugins:
  - `protoc-gen-prost`
  - `protoc-gen-tonic`
