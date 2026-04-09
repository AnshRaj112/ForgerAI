import { connect, consumerOpts, JSONCodec } from "nats";
import { logger } from "./logger.js";
import { broadcastForgeEvent } from "./broadcast.js";

/**
 * Ensures a JetStream stream exists, then subscribes and bridges JSON messages to Socket.IO.
 * @param {object} params
 * @param {string} params.url
 * @param {string} params.streamName
 * @param {string} params.subject
 * @param {string} params.durableName
 * @param {import("bullmq").Queue} [params.persistQueue]
 */
export async function startNatsBridge({ url, streamName, subject, durableName, persistQueue }) {
  const nc = await connect({ servers: url });
  const jsm = await nc.jetstreamManager();
  const streamSubjects = ["forge.>"];

  try {
    await jsm.streams.info(streamName);
  } catch {
    await jsm.streams.add({
      name: streamName,
      subjects: streamSubjects,
      retention: "limits",
    });
    logger.info("nats jetstream stream created", { streamName, subjects: streamSubjects });
  }

  const js = nc.jetstream();
  const jc = JSONCodec();

  const opts = consumerOpts();
  opts.durable(durableName);
  opts.manualAck();
  opts.ackExplicit();
  opts.deliverNew();

  const sub = await js.subscribe(subject, opts);

  (async () => {
    for await (const m of sub) {
      try {
        const decoded = jc.decode(m.data);
        const event =
          decoded && typeof decoded === "object"
            ? { ...decoded, _transport: "nats" }
            : { payload: decoded, _transport: "nats" };
        broadcastForgeEvent(event);
        if (persistQueue) {
          try {
            await persistQueue.add("persist", { event, source: "nats" });
          } catch (err) {
            logger.warn("bullmq persist enqueue failed (nats)", { err: String(err) });
          }
        }
        m.ack();
      } catch (err) {
        logger.error("nats bridge handler error", { err: String(err) });
        m.nak();
      }
    }
  })().catch((err) => logger.error("nats subscribe loop exited", { err: String(err) }));

  logger.info("nats jetstream subscribed", { subject, durableName });

  return {
    nc,
    async close() {
      try {
        await sub.drain();
      } catch (err) {
        logger.warn("nats subscription drain", { err: String(err) });
      }
      try {
        await nc.drain();
      } catch (err) {
        logger.warn("nats connection drain", { err: String(err) });
        await nc.close();
      }
      logger.info("nats disconnected");
    },
  };
}
