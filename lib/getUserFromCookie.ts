"use server";
import { cookies } from "next/headers";

const safeParseResponse = async (response: Response): Promise<{
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

export const getUserFromCookie = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";
    const res = await fetch(`${baseUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const parseResult = await safeParseResponse(res);
      
      if (parseResult.error) {
        console.error("Failed to parse profile response:", parseResult.error);
        return null;
      }
      
      if (!parseResult.isJson) {
        console.warn("Non-JSON response from profile:", parseResult.data);
        return null;
      }
      
      return parseResult.data;
    }
    // fallback: если профиля нет — попробуем по username из JWT куки нет доступа здесь; вернем null
    return null;
  } catch (err) {
    return null;
  }
};

