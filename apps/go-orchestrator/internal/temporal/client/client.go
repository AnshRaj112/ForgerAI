package temporalclient

import (
	"fmt"

	"go.temporal.io/sdk/client"
)

func Connect(hostPort, namespace string) (client.Client, error) {
	c, err := client.Dial(client.Options{
		HostPort:  hostPort,
		Namespace: namespace,
	})
	if err != nil {
		return nil, fmt.Errorf("connect temporal: %w", err)
	}
	return c, nil
}
