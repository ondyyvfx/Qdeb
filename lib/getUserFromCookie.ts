"use server";
import { cookies } from "next/headers";
import type { User } from "@/stores/useUserStore";

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

// Тип для ответа API профиля
interface ApiProfileResponse {
  id?: number;
  username?: string;
  email?: string;
  fullName?: string;
  full_name?: string;
  phone?: string;
  description?: string;
  profilePicture?: string;
  profilePictureUrl?: string;
  avatar?: string;
  elo_rating?: number;
  tournaments_completed?: number;
  avg_speech?: number;
  std_deviation?: number;
  total_achievements?: number;
  roles?: string[] | Array<{ id: number; name: string }>;
  [key: string]: unknown;
}

// Функция для преобразования данных API в тип User
const mapApiProfileToUser = (data: unknown, baseUrl: string): User | null => {
  if (!data || typeof data !== "object") {
    return null;
  }

  const apiData = data as ApiProfileResponse;

  // Проверяем обязательные поля
  if (!apiData.email) {
    return null;
  }

  // Получаем full_name из fullName или full_name
  const fullName = apiData.full_name || apiData.fullName;
  if (!fullName || typeof fullName !== "string") {
    return null;
  }

  // Получаем avatar из profilePicture, profilePictureUrl или avatar
  let avatar = apiData.avatar || apiData.profilePictureUrl || apiData.profilePicture || "";
  
  // Если avatar - относительный путь, преобразуем в полный URL
  if (avatar && !avatar.startsWith("http") && avatar.trim() !== "") {
    const apiOrigin = baseUrl.replace(/\/api\/?$/, "");
    avatar = avatar.startsWith("/") 
      ? `${apiOrigin}${avatar}` 
      : `${apiOrigin}/${avatar}`;
  }
  
  // Если avatar пустой, используем дефолтное значение
  if (!avatar || avatar.trim() === "") {
    avatar = "/assets/Qback.svg";
  }

  // Обрабатываем роли - они могут быть массивом строк или объектов
  let roles: string[] | undefined;
  if (apiData.roles) {
    if (Array.isArray(apiData.roles)) {
      roles = apiData.roles.map((role) => {
        if (typeof role === "string") {
          return role;
        } else if (typeof role === "object" && role !== null && "name" in role) {
          return (role as { name: string }).name;
        }
        return String(role);
      });
    }
  }

  const user: User = {
    email: apiData.email,
    full_name: fullName,
    phone: apiData.phone,
    description: apiData.description,
    elo_rating: typeof apiData.elo_rating === "number" ? apiData.elo_rating : undefined,
    tournaments_completed: typeof apiData.tournaments_completed === "number" ? apiData.tournaments_completed : undefined,
    avg_speech: typeof apiData.avg_speech === "number" ? apiData.avg_speech : undefined,
    std_deviation: typeof apiData.std_deviation === "number" ? apiData.std_deviation : undefined,
    total_achievements: typeof apiData.total_achievements === "number" ? apiData.total_achievements : undefined,
    avatar,
    roles,
  };

  return user;
};

export const getUserFromCookie = async (): Promise<User | null> => {
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
      
      return mapApiProfileToUser(parseResult.data, baseUrl);
    }
    // fallback: если профиля нет — попробуем по username из JWT куки нет доступа здесь; вернем null
    return null;
  } catch (err) {
    console.error("Error in getUserFromCookie:", err);
    return null;
  }
};

