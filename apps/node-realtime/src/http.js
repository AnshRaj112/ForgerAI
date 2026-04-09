import express from "express";
import cors from "cors";
import { broadcastForgeEvent } from "./broadcast.js";
import { logger } from "./logger.js";

export function createHttpApp({ config, queue, runHealthChecks }) {
  const app = express();
  app.use(
    cors({
      origin: config.corsOrigins.length ? config.corsOrigins : true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));

  /** Discovery endpoint for clients (Socket.IO uses this path for the engine). */
  app.get("/socket", (_req, res) => {
    res.json({
      ok: true,
      engine: "socket.io",
      path: config.socketPath,
      hint: `Use io(baseUrl, { path: "${config.socketPath}", transports: ["websocket"] })`,
    });
  });

  app.get("/health", async (_req, res) => {
    try {
      const checks = await runHealthChecks();
      const ok = Object.values(checks).every((c) => c === "ok");
      res.status(ok ? 200 : 503).json({
        ok,
        service: "node-realtime",
        version: "0.1.0",
        checks,
        socketPath: config.socketPath,
      });
    } catch (err) {
      logger.error("health check error", { err: String(err) });
      res.status(503).json({
        ok: false,
        service: "node-realtime",
        checks: { error: String(err) },
      });
    }
  });

  /**
   * Ingest HTTP events (e.g. from Next.js API routes). Broadcasts immediately and enqueues
   * durable persistence via BullMQ.
   */
  app.post("/events", async (req, res) => {
    const event = req.body;
    if (!event || typeof event !== "object") {
      return res.status(400).json({ ok: false, error: "JSON body required" });
    }
    broadcastForgeEvent(event);
    await queue.add("persist", { event, source: "http" });
    return res.json({ ok: true });
  });

  return app;
}
