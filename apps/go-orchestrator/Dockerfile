FROM golang:1.23-alpine AS builder

WORKDIR /src
COPY apps/go-orchestrator/go.mod apps/go-orchestrator/go.sum ./
RUN go mod download

COPY apps/go-orchestrator ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/go-orchestrator ./cmd

FROM alpine:3.20
RUN adduser -D -H -s /sbin/nologin appuser
USER appuser

WORKDIR /app
COPY --from=builder /out/go-orchestrator /app/go-orchestrator

EXPOSE 4001 50051
ENTRYPOINT ["/app/go-orchestrator"]
