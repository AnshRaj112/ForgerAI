#!/usr/bin/env sh
set -eu

MODE="${1:-all}"
ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
PROTO_DIR="$ROOT_DIR"
OUT_DIR="$ROOT_DIR/generated"

mkdir -p "$OUT_DIR/go" "$OUT_DIR/python" "$OUT_DIR/rust"

generate_go() {
  protoc \
    -I "$PROTO_DIR" \
    --go_out="$OUT_DIR/go" \
    --go-grpc_out="$OUT_DIR/go" \
    "$PROTO_DIR/common.proto" \
    "$PROTO_DIR/agent.proto"
}

generate_python() {
  python -m grpc_tools.protoc \
    -I "$PROTO_DIR" \
    --python_out="$OUT_DIR/python" \
    --grpc_python_out="$OUT_DIR/python" \
    "$PROTO_DIR/common.proto" \
    "$PROTO_DIR/agent.proto"
}

generate_rust() {
  protoc \
    -I "$PROTO_DIR" \
    --prost_out="$OUT_DIR/rust" \
    --tonic_out="$OUT_DIR/rust" \
    "$PROTO_DIR/common.proto" \
    "$PROTO_DIR/agent.proto"
}

case "$MODE" in
  all)
    generate_go
    generate_python
    generate_rust
    ;;
  go)
    generate_go
    ;;
  python)
    generate_python
    ;;
  rust)
    generate_rust
    ;;
  *)
    echo "Unknown mode: $MODE"
    exit 1
    ;;
esac

echo "Proto generation completed ($MODE)"
