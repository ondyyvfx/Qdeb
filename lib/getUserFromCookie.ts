import Cookies from "js-cookie";
import { useUserStore } from "@/stores/useUserStore";

export const getUserFromCookie = async () => {
  const token = Cookies.get("accessToken");
  if (!token) return;

  try {
    const res = await fetch("https://qdeb.kz/api/auth/profile/", {
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
