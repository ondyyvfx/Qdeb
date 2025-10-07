"use client";

import Image from "next/image";
import { useUserStore } from "@/stores/useUserStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Cookies from "js-cookie";

interface UserProfile {
  id: number;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  description?: string;
  profilePictureUrl?: string;
  elo_rating?: number;
  tournaments_completed?: number;
  avg_speech?: number;
  total_achievements?: number;
}

const ProfileView = () => {
  const user = useUserStore((state) => state.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const apiBase =
    (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:5639/api";

  const resolveImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // Always prefix with /api to conform backend routing
    const normalized = url.startsWith("/") ? url : `/${url}`;
    return `${apiBase}${normalized}`;
  };

  // Загружаем профиль пользователя по username из JWT
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Получаем токен и извлекаем username (или email -> username)
        const token = Cookies.get("accessToken");
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = parts[1];
          const decodedPayload = JSON.parse(atob(payload));
          // В JWT может быть username напрямую, если нет — используем email до '@'
          const usernameFromToken = decodedPayload.username as
            | string
            | undefined;
          const email = (decodedPayload.sub as string) || "";

          const username =
            usernameFromToken || (email ? email.split("@")[0] : "");

          if (username) {
            // Получаем полную информацию о пользователе строго по API
            const response = await apiGet<UserProfile>(`/users/${username}`);

            if (response.error) {
              console.error("Ошибка получения профиля:", response.error);
            } else if (response.data) {
              setProfile(response.data);
            }
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-background shadow-2xl rounded-2xl mt-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-background shadow-2xl rounded-2xl mt-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Пользователь не найден
          </h1>
          <p className="mt-2 text-gray-400">
            Войдите в систему для просмотра профиля
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-background shadow-2xl rounded-2xl mt-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Профиль не найден</h1>
          <p className="mt-2 text-gray-400">
            Не удалось загрузить данные профиля
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-background shadow-2xl rounded-2xl mt-8 flex flex-col gap-8">
      {/* Заголовок профиля */}
      <div className="flex items-center gap-10">
        {resolveImageUrl(profile.profilePictureUrl) || user?.avatar ? (
          <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-primary shadow-lg">
            <Image
              src={
                resolveImageUrl(profile.profilePictureUrl) ||
                (user?.avatar as string)
              }
              alt="User avatar"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {profile.fullName
              ? profile.fullName.charAt(0).toUpperCase()
              : profile.email
              ? profile.email.charAt(0).toUpperCase()
              : "U"}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-accent">
            {profile.fullName ||
              (profile.email ? profile.email.split("@")[0] : "Пользователь")}
          </h1>
          <p className="text-lg text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      {/* Основная информация */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-white">
            Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-white font-medium">
              {profile.email || "Не указан"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Полное имя</p>
            <p className="text-white font-medium">
              {profile.fullName || "Не указано"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Телефон</p>
            <p className="text-white font-medium">
              {profile.phone || "Не указан"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Логин (username)</p>
            <p className="text-white font-medium">
              {profile.username ||
                (profile.email ? profile.email.split("@")[0] : "Не указан")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
