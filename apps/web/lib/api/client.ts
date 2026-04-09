const API_BASE = "";

export const apiClient = {
  compile: async (payload: unknown) => {
    const response = await fetch(`${API_BASE}/api/forge/compile`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.json();
  },
  deploy: async (payload: unknown) => {
    const response = await fetch(`${API_BASE}/api/forge/deploy`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.json();
  },
  status: async (jobId: string) => {
    const response = await fetch(`${API_BASE}/api/forge/status/${jobId}`);
    return response.json();
  },
};
