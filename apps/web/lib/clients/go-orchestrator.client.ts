import { createHttpClient } from "./http";
import type { CompileResult, DeployResult, OrchestratorCompileRequest, OrchestratorDeployRequest, ServiceHealth } from "./types";

export const createGoOrchestratorClient = (baseUrl: string) => {
  const http = createHttpClient({ serviceName: "go-orchestrator", baseUrl });

  return {
    health: () => http.get<ServiceHealth>("/health"),
    compile: (payload: OrchestratorCompileRequest) => http.post<CompileResult, OrchestratorCompileRequest>("/compile", payload),
    deploy: (payload: OrchestratorDeployRequest) => http.post<DeployResult, OrchestratorDeployRequest>("/deploy", payload),
    getStatus: (jobId: string) => http.get<CompileResult>(`/jobs/${jobId}`),
  };
};

export type GoOrchestratorClient = ReturnType<typeof createGoOrchestratorClient>;
