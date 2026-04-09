import http from "node:http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.emit("forge:connected", {
    ok: true,
    message: "Connected to ForgeAI realtime gateway",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "node-realtime" });
});

app.post("/events", (req, res) => {
  const event = req.body;
  io.emit("forge:event", event);
  return res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 4010);
server.listen(port, () => {
  console.log(`node-realtime listening on :${port}`);
});
