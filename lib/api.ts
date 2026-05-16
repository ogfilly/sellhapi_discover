import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import type { ApiError } from "@/types/api";
import { API_BASE_URL } from "./constants";

// ── Client instance ───────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL:         API_BASE_URL,
  withCredentials: true,
  timeout:         15_000,
  headers: {
    "Content-Type": "application/json",
    "Accept":       "application/json",
  },
});

// ── Request interceptor — attach token from session storage fallback ──────────

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("c_token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — normalise errors ───────────────────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const status  = error.response?.status;
    const message = error.response?.data?.error ?? error.message;

    if (status === 401) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("c_token");
      }
    }

    return Promise.reject({
      error:   message,
      status:  status ?? 0,
      details: error.response?.data?.details,
    } satisfies ApiError);
  }
);

// ── Generic request wrapper ───────────────────────────────────────────────────

export async function apiRequest<TResponse>(
  config: AxiosRequestConfig
): Promise<TResponse> {
  const response = await apiClient.request<TResponse>(config);
  return response.data;
}

// ── Server-side fetcher (Server Components only) ─────────────────────────────

export async function serverFetch<TResponse>(
  path:    string,
  options: {
    token?:      string;
    revalidate?: number;
    tags?:       string[];
    params?:     Record<string, string | number | boolean>;
  } = {}
): Promise<TResponse> {
  const { token, revalidate = 60, tags, params } = options;

  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.set(k, String(v))
    );
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept":       "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate, ...(tags ? { tags } : {}) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw {
      error:  body.error ?? `HTTP ${res.status}`,
      status: res.status,
    } satisfies ApiError;
  }

  return res.json();
}
