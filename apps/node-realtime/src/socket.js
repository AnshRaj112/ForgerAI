import { Server } from "socket.io";
import { logger } from "./logger.js";
import { setIo } from "./broadcast.js";

/**
 * @param {import("http").Server} httpServer
 * @param {{ socketPath: string; corsOrigins: string[] }} config
 */
export function attachSocketIo(httpServer, config) {
  const io = new Server(httpServer, {
    path: config.socketPath,
    cors: {
      origin: config.corsOrigins.length ? config.corsOrigins : true,
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  setIo(io);

  io.on("connection", (socket) => {
    logger.info("socket connected", { id: socket.id });
    socket.emit("forge:connected", {
      ok: true,
      message: "Connected to ForgeAI realtime gateway",
      socketPath: config.socketPath,
      timestamp: new Date().toISOString(),
    });
  });

  return io;
}
