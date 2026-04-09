import { createHttpClient } from "./http";
import type { ServiceHealth } from "./types";

export const createJavaEnterpriseClient = (baseUrl: string) => {
  const http = createHttpClient({ serviceName: "java-enterprise", baseUrl });

  return {
    health: () => http.get<ServiceHealth>("/health"),
    complianceCheck: (payload: { agentId: string }) =>
      http.post<{ ok: true; compliant: boolean }, { agentId: string }>("/compliance/check", payload),
  };
};

export type JavaEnterpriseClient = ReturnType<typeof createJavaEnterpriseClient>;
