package bootstrap

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/nats-io/nats.go"
	"go.mongodb.org/mongo-driver/mongo"
	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"

	"github.com/forgerai/go-orchestrator/internal/config"
	"github.com/forgerai/go-orchestrator/internal/db"
	"github.com/forgerai/go-orchestrator/internal/messaging"
	"github.com/forgerai/go-orchestrator/internal/orchestrator"
	grpcserver "github.com/forgerai/go-orchestrator/internal/server/grpc"
	httpserver "github.com/forgerai/go-orchestrator/internal/server/http"
	temporalclient "github.com/forgerai/go-orchestrator/internal/temporal/client"
	workerx "github.com/forgerai/go-orchestrator/internal/temporal/worker"
)

type App struct {
	cfg config.Config

	mongoClient *mongo.Client
	natsConn    *nats.Conn
	temporal    client.Client

	temporalWorker worker.Worker
	httpServer     *httpserver.Server
	grpcServer     *grpcserver.Server
}

func NewApp(ctx context.Context, cfg config.Config) (*App, error) {
	mongoClient, err := db.ConnectMongo(ctx, cfg.MongoURI)
	if err != nil {
		return nil, err
	}

	natsConn, err := messaging.ConnectNATS(ctx, cfg.NATSURL)
	if err != nil {
		_ = mongoClient.Disconnect(context.Background())
		return nil, err
	}

	temporal, err := temporalclient.Connect(cfg.TemporalHostPort, cfg.TemporalNamespace)
	if err != nil {
		natsConn.Close()
		_ = mongoClient.Disconnect(context.Background())
		return nil, err
	}

	svc := orchestrator.NewService(mongoClient, temporal, cfg.TemporalTaskQueue)
	httpSrv := httpserver.New(cfg.HTTPPort, svc)
	grpcSrv, err := grpcserver.New(cfg.GRPCPort)
	if err != nil {
		temporal.Close()
		natsConn.Close()
		_ = mongoClient.Disconnect(context.Background())
		return nil, err
	}

	return &App{
		cfg:            cfg,
		mongoClient:    mongoClient,
		natsConn:       natsConn,
		temporal:       temporal,
		temporalWorker: workerx.New(temporal, cfg.TemporalTaskQueue),
		httpServer:     httpSrv,
		grpcServer:     grpcSrv,
	}, nil
}

func (a *App) Run(ctx context.Context) error {
	workerErr := make(chan error, 1)
	httpErr := make(chan error, 1)
	grpcErr := make(chan error, 1)

	go func() {
		workerErr <- a.temporalWorker.Run(worker.InterruptCh())
	}()
	go func() {
		log.Printf("http listening on :%d", a.cfg.HTTPPort)
		httpErr <- a.httpServer.Start()
	}()
	go func() {
		log.Printf("grpc listening on :%d", a.cfg.GRPCPort)
		grpcErr <- a.grpcServer.Start()
	}()

	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), a.cfg.ShutdownTimeout)
		defer cancel()
		return a.Close(shutdownCtx)
	case err := <-workerErr:
		if err != nil {
			return fmt.Errorf("temporal worker: %w", err)
		}
	case err := <-httpErr:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			return fmt.Errorf("http server: %w", err)
		}
	case err := <-grpcErr:
		if err != nil {
			return fmt.Errorf("grpc server: %w", err)
		}
	}

	return nil
}

func (a *App) Close(ctx context.Context) error {
	var firstErr error

	if err := a.httpServer.Shutdown(ctx); err != nil && !errors.Is(err, context.Canceled) {
		firstErr = err
	}
	if err := a.grpcServer.Shutdown(ctx); err != nil && !errors.Is(err, context.Canceled) && firstErr == nil {
		firstErr = err
	}

	stopCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = a.mongoClient.Disconnect(stopCtx)
	a.natsConn.Close()
	a.temporal.Close()

	return firstErr
}
