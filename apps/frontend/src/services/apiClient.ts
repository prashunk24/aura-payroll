import { API_BASE_URL } from "@/config/api";

/** Thin fetch wrapper. Replace transport here without touching components. */
export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers ?? {}) },
  });
  
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) => apiRequest<T>(path, { method: "GET", ...options }),
  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined, ...options }),
  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined, ...options }),
  del: <T>(path: string, options?: RequestInit) => apiRequest<T>(path, { method: "DELETE", ...options }),
};
