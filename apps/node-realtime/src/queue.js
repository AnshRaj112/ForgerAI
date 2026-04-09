import { Queue, Worker } from "bullmq";
import { logger } from "./logger.js";

/**
 * @param {object} input
 * @param {import("ioredis").default} input.connection
 * @param {string} input.queueName
 * @param {() => Promise<import("mongodb").Collection>} input.getCollection
 */
export function createQueueAndWorker({ connection, queueName, getCollection }) {
  const queue = new Queue(queueName, { connection });

  const workerConnection = connection.duplicate({ maxRetriesPerRequest: null });

  const worker = new Worker(
    queueName,
    async (job) => {
      const { name, data } = job;
      if (name === "persist") {
        const col = await getCollection();
        await col.insertOne({
          ...data.event,
          _ingestedAt: new Date(),
          _source: data.source ?? "unknown",
        });
        return { ok: true };
      }
      throw new Error(`unknown job name: ${name}`);
    },
    { connection: workerConnection },
  );

  worker.on("failed", (job, err) => {
    logger.error("bullmq job failed", { id: job?.id, name: job?.name, err: String(err) });
  });

  worker.on("completed", (job) => {
    logger.debug("bullmq job completed", { id: job.id, name: job.name });
  });

  return {
    queue,
    worker,
    async close() {
      await worker.close();
      await queue.close();
      await workerConnection.quit();
    },
  };
}
