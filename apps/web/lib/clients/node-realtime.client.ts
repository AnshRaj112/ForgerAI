import { createHttpClient } from "./http";
import type { RuntimeEvent } from "@forgerai/types";
import type { ServiceHealth } from "./types";

export const createNodeRealtimeClient = (baseUrl: string) => {
  const http = createHttpClient({ serviceName: "node-realtime", baseUrl });

  return {
    health: () => http.get<ServiceHealth>("/health"),
    publishEvent: (event: RuntimeEvent) => http.post<{ ok: true }, RuntimeEvent>("/events", event),
  };
};

export type NodeRealtimeClient = ReturnType<typeof createNodeRealtimeClient>;
