import { createHttpClient } from "./http";
import type { ServiceHealth } from "./types";

export type JavaEnterpriseClientOptions = {
  /** If set, sent as Authorization: Bearer … for secured /api/enterprise/* routes. */
  token?: string;
};

export const createJavaEnterpriseClient = (baseUrl: string, options?: JavaEnterpriseClientOptions) => {
  const defaultHeaders: HeadersInit | undefined =
    options?.token !== undefined && options.token !== ""
      ? { Authorization: `Bearer ${options.token}` }
      : undefined;
  const http = createHttpClient({ serviceName: "java-enterprise", baseUrl, defaultHeaders });

  return {
    health: () => http.get<ServiceHealth>("/health"),
    complianceCheck: (payload: { agentId: string }) =>
      http.post<{ ok: true; compliant: boolean; agentId?: string }, { agentId: string }>(
        "/api/enterprise/compliance/check",
        payload,
      ),
  };
};

export type JavaEnterpriseClient = ReturnType<typeof createJavaEnterpriseClient>;
