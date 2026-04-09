import { createHttpClient } from "./http";
import type { ServiceHealth } from "./types";

export const createRubyWorkflowClient = (baseUrl: string) => {
  const http = createHttpClient({ serviceName: "ruby-workflow", baseUrl });

  return {
    health: () => http.get<ServiceHealth>("/health"),
    startWorkflow: (payload: { workflowId: string; input?: Record<string, unknown> }) =>
      http.post<{ ok: true; runId: string }, { workflowId: string; input?: Record<string, unknown> }>(
        "/workflows/start",
        payload,
      ),
  };
};

export type RubyWorkflowClient = ReturnType<typeof createRubyWorkflowClient>;
