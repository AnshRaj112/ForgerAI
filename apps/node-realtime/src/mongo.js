import { MongoClient } from "mongodb";
import { logger } from "./logger.js";

/** @type {MongoClient | null} */
let client = null;

/**
 * @param {string} uri
 * @returns {Promise<MongoClient>}
 */
export async function connectMongo(uri) {
  if (client) return client;
  client = new MongoClient(uri, { maxPoolSize: 10 });
  await client.connect();
  logger.info("mongodb connected");
  return client;
}

export function getMongoClient() {
  return client;
}

export async function disconnectMongo() {
  if (!client) return;
  await client.close();
  client = null;
  logger.info("mongodb disconnected");
}

/**
 * @param {import("mongodb").MongoClient} c
 * @param {string} collectionName
 */
export function getEventsCollection(c, collectionName) {
  return c.db().collection(collectionName);
}
