package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	ServiceName  string
	HTTPPort     int
	GRPCPort     int
	MongoURI     string
	DatabaseName string
	NATSURL      string

	TemporalHostPort string
	TemporalNamespace string
	TemporalTaskQueue string

	ShutdownTimeout time.Duration
}

func Load() Config {
	return Config{
		ServiceName:      getEnv("SERVICE_NAME", "go-orchestrator"),
		HTTPPort:         getEnvInt("PORT", 4001),
		GRPCPort:         getEnvInt("GRPC_PORT", 50051),
		MongoURI:         getEnv("FORGE_DATABASE_URL", "mongodb://localhost:27017"),
		DatabaseName:     getEnv("FORGE_DATABASE_NAME", "forgeai"),
		NATSURL:          getEnv("FORGE_NATS_URL", "nats://localhost:4222"),
		TemporalHostPort: getEnv("TEMPORAL_HOST_PORT", "localhost:7233"),
		TemporalNamespace: getEnv("TEMPORAL_NAMESPACE", "default"),
		TemporalTaskQueue: getEnv("TEMPORAL_TASK_QUEUE", "forgeai-orchestrator"),
		ShutdownTimeout:  getEnvDuration("SHUTDOWN_TIMEOUT", 15*time.Second),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	value := getEnv(key, "")
	if value == "" {
		return fallback
	}
	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}
	return parsed
}

func getEnvDuration(key string, fallback time.Duration) time.Duration {
	value := getEnv(key, "")
	if value == "" {
		return fallback
	}
	parsed, err := time.ParseDuration(value)
	if err != nil {
		return fallback
	}
	return parsed
}
