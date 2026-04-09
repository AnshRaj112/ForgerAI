import { createHttpClient } from "./http";
import type { RunAgentRequest, RunAgentResult, ServiceHealth } from "./types";

export const createPythonAiClient = (baseUrl: string) => {
  const http = createHttpClient({ serviceName: "python-ai", baseUrl });

  return {
    health: () => http.get<ServiceHealth>("/health"),
    runAgent: (payload: RunAgentRequest) => http.post<RunAgentResult, RunAgentRequest>("/agents/run", payload),
    embeddings: (input: { text: string }) => http.post<{ embedding: number[] }, { text: string }>("/embeddings", input),
  };
};

export type PythonAiClient = ReturnType<typeof createPythonAiClient>;
