import http from "node:http";
import { loadConfig } from "./config.js";
import { logger } from "./logger.js";
import { connectMongo, disconnectMongo, getMongoClient, getEventsCollection } from "./mongo.js";
import { createRedisConnection } from "./redis.js";
import { createQueueAndWorker } from "./queue.js";
import { attachSocketIo } from "./socket.js";
import { createHttpApp } from "./http.js";
import { startNatsBridge } from "./nats.js";

const config = loadConfig();

const redisConnection = createRedisConnection(config.redisUrl);

let natsBridge = null;
let queueBundle = null;

async function getCollection() {
  const client = getMongoClient();
  if (!client) throw new Error("mongo not initialized");
  return getEventsCollection(client, config.mongoCollection);
}

async function runHealthChecks() {
  const checks = { redis: "fail", mongo: "fail", nats: "fail" };

  try {
    const pong = await redisConnection.ping();
    checks.redis = pong === "PONG" ? "ok" : "fail";
  } catch {
    checks.redis = "fail";
  }

  try {
    const client = getMongoClient();
    if (client) {
      await client.db().command({ ping: 1 });
      checks.mongo = "ok";
    }
  } catch {
    checks.mongo = "fail";
  }

  try {
    if (natsBridge?.nc && !natsBridge.nc.isClosed()) {
      await natsBridge.nc.flush();
      checks.nats = "ok";
    }
  } catch {
    checks.nats = "fail";
  }

  return checks;
}

async function main() {
  await connectMongo(config.mongoUri);

  queueBundle = createQueueAndWorker({
    connection: redisConnection,
    queueName: config.bullmqQueueName,
    getCollection,
  });

  natsBridge = await startNatsBridge({
    url: config.natsUrl,
    streamName: config.natsStreamName,
    subject: config.natsConsumerSubject,
    durableName: config.natsDurableName,
    persistQueue: queueBundle.queue,
  });

  const app = createHttpApp({
    config,
    queue: queueBundle.queue,
    runHealthChecks,
  });

  const server = http.createServer(app);
  attachSocketIo(server, config);

  server.listen(config.port, () => {
    logger.info("node-realtime listening", {
      port: config.port,
      socketPath: config.socketPath,
      queue: config.bullmqQueueName,
    });
  });

  const shutdown = async (signal) => {
    logger.info("shutdown", { signal });
    server.close();
    if (queueBundle) await queueBundle.close();
    if (natsBridge) await natsBridge.close();
    await disconnectMongo();
    await redisConnection.quit();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.error("fatal", { err: String(err) });
  process.exit(1);
});
