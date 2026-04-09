import type { RuntimeEvent } from "@forgerai/types";

const realtimeEndpoint = process.env.FORGE_REALTIME_EVENT_URL ?? "http://localhost:4010/events";

export const emitRealtimeEvent = async (event: RuntimeEvent): Promise<void> => {
  try {
    await fetch(realtimeEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(event),
    });
  } catch {
    // Realtime delivery should not fail compile/deploy flow.
  }
};
