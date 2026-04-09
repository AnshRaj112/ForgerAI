/** @type {import("socket.io").Server | null} */
let ioRef = null;

export function setIo(io) {
  ioRef = io;
}

export function getIo() {
  return ioRef;
}

/**
 * Fan-out agent / pipeline events to all connected Socket.IO clients.
 * @param {Record<string, unknown>} event
 */
export function broadcastForgeEvent(event) {
  if (!ioRef) return;
  ioRef.emit("forge:event", event);
}
