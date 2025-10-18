import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = Cookies.get("accessToken");
  
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`, {
        url: `${API_URL}${endpoint}`,
        status: response.status,
        data: data
      });
      return {
        error: data?.detail || data?.message || `HTTP ${response.status}`,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      error: "Network error",
      status: 0,
    };
  }
};

// Convenience methods
export const apiGet = <T = unknown>(endpoint: string) => 
  apiRequest<T>(endpoint, { method: "GET" });

export const apiPost = <T = unknown>(endpoint: string, body?: unknown) => 
  apiRequest<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

