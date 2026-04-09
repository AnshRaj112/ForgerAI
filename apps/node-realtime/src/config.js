/**
 * Central configuration from environment (12-factor). Defaults suit local dev.
 */
export function loadConfig() {
  const port = Number(process.env.PORT ?? 4010);
  const redisUrl = process.env.FORGE_REDIS_URL ?? "redis://127.0.0.1:6379";
  const mongoUri =
    process.env.FORGE_DATABASE_URL ?? "mongodb://127.0.0.1:27017/forgeai";
  const natsUrl = process.env.FORGE_NATS_URL ?? "nats://127.0.0.1:4222";

  const corsRaw = process.env.FORGE_CORS_ORIGINS ?? "http://localhost:3000,http://127.0.0.1:3000";
  const corsOrigins = corsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    port,
    redisUrl,
    mongoUri,
    natsUrl,
    corsOrigins,
    /** Socket.IO HTTP long-polling + WS path (client must use the same path). */
    socketPath: process.env.FORGE_SOCKET_PATH ?? "/socket",
    natsStreamName: process.env.FORGE_NATS_STREAM ?? "FORGE",
    /** JetStream filter: messages under this subject pattern are bridged to clients. */
    natsConsumerSubject: process.env.FORGE_NATS_CONSUMER_SUBJECT ?? "forge.>",
    natsDurableName: process.env.FORGE_NATS_DURABLE ?? "node-realtime-bridge",
    bullmqQueueName: process.env.FORGE_QUEUE_NAME ?? "forge-realtime-events",
    mongoCollection: process.env.FORGE_REALTIME_COLLECTION ?? "realtime_events",
  };
}
