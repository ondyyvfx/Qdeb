import Cookies from "js-cookie";
import { useUserStore } from "@/stores/useUserStore";

export const getUserFromCookie = async () => {
  const token = Cookies.get("accessToken");
  if (!token) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      useUserStore.getState().setUser(data);
    } else {
      console.error("Не удалось получить профиль");
    }
  } catch (err) {
    console.error("Ошибка при получении профиля:", err);
  }
};
