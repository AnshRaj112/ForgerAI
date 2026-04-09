export class HttpClientError extends Error {
  public readonly status: number;
  public readonly service: string;
  public readonly details?: unknown;

  constructor(input: { message: string; status: number; service: string; details?: unknown }) {
    super(input.message);
    this.name = "HttpClientError";
    this.status = input.status;
    this.service = input.service;
    this.details = input.details;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions<TBody> = {
  path: string;
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export type HttpClientConfig = {
  serviceName: string;
  baseUrl: string;
  defaultHeaders?: HeadersInit;
};

export const createHttpClient = (config: HttpClientConfig) => {
  const request = async <TResponse, TBody = unknown>(options: RequestOptions<TBody>): Promise<TResponse> => {
    const { path, method = "GET", body, headers, signal } = options;

    const response = await fetch(`${config.baseUrl}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...config.defaultHeaders,
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json") ? await response.json().catch(() => null) : await response.text();

    if (!response.ok) {
      throw new HttpClientError({
        message: `[${config.serviceName}] Request failed with status ${response.status}`,
        status: response.status,
        service: config.serviceName,
        details: payload,
      });
    }

    return payload as TResponse;
  };

  return {
    get: <TResponse>(path: string, options?: Omit<RequestOptions<never>, "path" | "method" | "body">) =>
      request<TResponse>({ path, method: "GET", ...options }),
    post: <TResponse, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody>, "path" | "method" | "body">,
    ) => request<TResponse, TBody>({ path, method: "POST", body, ...options }),
    put: <TResponse, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody>, "path" | "method" | "body">,
    ) => request<TResponse, TBody>({ path, method: "PUT", body, ...options }),
    patch: <TResponse, TBody = unknown>(
      path: string,
      body?: TBody,
      options?: Omit<RequestOptions<TBody>, "path" | "method" | "body">,
    ) => request<TResponse, TBody>({ path, method: "PATCH", body, ...options }),
    delete: <TResponse>(path: string, options?: Omit<RequestOptions<never>, "path" | "method" | "body">) =>
      request<TResponse>({ path, method: "DELETE", ...options }),
  };
};
