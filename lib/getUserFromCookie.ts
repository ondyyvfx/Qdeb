"use server";
import { cookies } from "next/headers";

export const getUserFromCookie = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api";
    const res = await fetch(`${baseUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
    // fallback: если профиля нет — попробуем по username из JWT куки нет доступа здесь; вернем null
    return null;
  } catch (err) {
    return null;
  }
};
