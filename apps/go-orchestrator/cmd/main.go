package main

import (
	"context"
	"log"
	"os/signal"
	"syscall"

	"github.com/forgerai/go-orchestrator/internal/bootstrap"
	"github.com/forgerai/go-orchestrator/internal/config"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	cfg := config.Load()
	app, err := bootstrap.NewApp(ctx, cfg)
	if err != nil {
		log.Fatalf("bootstrap failed: %v", err)
	}
	defer app.Close(context.Background())

	if err := app.Run(ctx); err != nil {
		log.Fatalf("app exited with error: %v", err)
	}
}
