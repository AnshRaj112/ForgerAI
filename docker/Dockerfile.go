FROM golang:1.24-alpine AS builder

WORKDIR /src
# Pre-download dependencies to leverage Docker cache
COPY apps/go-orchestrator/go.mod apps/go-orchestrator/go.sum ./
RUN go mod download

# Build the binary
COPY apps/go-orchestrator ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/go-orchestrator ./cmd

# Final runtime image
FROM alpine:3.20
RUN apk add --no-cache ca-certificates
RUN adduser -D -H -s /sbin/nologin appuser
USER appuser

WORKDIR /app
COPY --from=builder /out/go-orchestrator /app/go-orchestrator

EXPOSE 4001 50051
ENTRYPOINT ["/app/go-orchestrator"]
