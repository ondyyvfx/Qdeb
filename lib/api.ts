import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

/**
 * Safely parse API response, handling both JSON and text responses
 * This function prevents JSON parsing errors when server returns Russian error messages
 * 
 * @param response - The fetch Response object
 * @returns Object with parsed data, format info, and any parsing errors
 * 
 * @example
 * ```typescript
 * const res = await fetch('/api/endpoint');
 * const parseResult = await safeParseResponse(res);
 * 
 * if (parseResult.error) {
 *   console.error('Parse error:', parseResult.error);
 * } else if (parseResult.isJson) {
 *   const data = parseResult.data as MyDataType;
 *   // Handle JSON data
 * } else {
 *   const text = parseResult.data as string;
 *   // Handle text data
 * }
 * ```
 */
export const safeParseResponse = async (response: Response): Promise<{
  data: unknown;
  isJson: boolean;
  error?: string;
}> => {
  try {
    const contentType = response.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      try {
        const data = await response.json();
        return { data, isJson: true };
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        // Fallback to text if JSON parsing fails
        try {
          const text = await response.text();
          return { data: text, isJson: false, error: "JSON parse failed" };
        } catch (textError) {
          return { data: null, isJson: false, error: "Failed to parse response" };
        }
      }
    } else {
      try {
        const text = await response.text();
        return { data: text, isJson: false };
      } catch (textError) {
        return { data: null, isJson: false, error: "Failed to get text response" };
      }
    }
  } catch (error) {
    console.error("Error in safeParseResponse:", error);
    return { data: null, isJson: false, error: "Parse error" };
  }
};

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
    "Accept": "application/json",
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
    mode: "cors",
    credentials: "include",
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    const parseResult = await safeParseResponse(response);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`, {
        url: `${API_URL}${endpoint}`,
        status: response.status,
        data: parseResult.data,
        parseError: parseResult.error
      });
      
      // Extract error message from different possible formats
      let errorMessage = `HTTP ${response.status}`;
      
      if (parseResult.error) {
        errorMessage = parseResult.error;
      } else if (typeof parseResult.data === "string") {
        errorMessage = parseResult.data;
      } else if (parseResult.data && typeof parseResult.data === "object") {
        const data = parseResult.data as Record<string, unknown>;
        errorMessage = data.detail || data.message || data.error || errorMessage;
      }
      
      return {
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      data: parseResult.data,
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

