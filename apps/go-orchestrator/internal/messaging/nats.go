package messaging

import (
	"context"
	"fmt"

	"github.com/nats-io/nats.go"
)

func ConnectNATS(_ context.Context, url string) (*nats.Conn, error) {
	conn, err := nats.Connect(url)
	if err != nil {
		return nil, fmt.Errorf("connect nats: %w", err)
	}
	return conn, nil
}
