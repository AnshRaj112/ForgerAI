import IORedis from "ioredis";
import { logger } from "./logger.js";

/**
 * BullMQ requires maxRetriesPerRequest: null on the ioredis instance.
 * @param {string} url
 * @returns {IORedis}
 */
export function createRedisConnection(url) {
  const conn = new IORedis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
  conn.on("error", (err) => logger.error("redis connection error", { err: String(err) }));
  return conn;
}
