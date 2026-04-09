import { createHttpClient } from "./http";
import type { ServiceHealth } from "./types";

export const createPhpCmsClient = (baseUrl: string) => {
  const http = createHttpClient({ serviceName: "php-cms", baseUrl });

  return {
    health: () => http.get<ServiceHealth>("/health"),
    publishContent: (payload: { title: string; body: string }) =>
      http.post<{ ok: true; contentId: string }, { title: string; body: string }>("/content/publish", payload),
  };
};

export type PhpCmsClient = ReturnType<typeof createPhpCmsClient>;
