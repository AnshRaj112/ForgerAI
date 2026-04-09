import { createHttpClient } from "./http";
import type { ServiceHealth } from "./types";

export type ExecuteTaskRequest = {
  task: string;
  payload?: Record<string, unknown>;
};

export type ExecuteTaskResult = {
  ok: true;
  result: unknown;
};

export const createRustExecutorClient = (baseUrl: string) => {
  const http = createHttpClient({ serviceName: "rust-executor", baseUrl });

  return {
    health: () => http.get<ServiceHealth>("/health"),
    execute: (payload: ExecuteTaskRequest) => http.post<ExecuteTaskResult, ExecuteTaskRequest>("/execute", payload),
  };
};

export type RustExecutorClient = ReturnType<typeof createRustExecutorClient>;
