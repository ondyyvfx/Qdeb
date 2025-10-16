"use client";

import Image from "next/image";
import { useUserStore } from "@/stores/useUserStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
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
  // team info per API doc
  teamId?: number;
  teamName?: string;
  teamCode?: string;
  teamSize?: number;
  teamLeader?: boolean;
}

const ProfileView = () => {
  const user = useUserStore((state) => state.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const apiBase =
    (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:4232/api";

  const resolveImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // Согласно документации, изображения доступны через /api/files/profile-picture/{fileName}
    if (url.includes("profile-picture") || url.startsWith("uploads/")) {
      return `${apiBase.replace("/api", "")}/api/files/profile-picture/${url}`;
    }
    // Для других файлов
    const normalized = url.startsWith("/") ? url : `/${url}`;
    return `${apiBase.replace("/api", "")}${normalized}`;
  };

  // Загружаем профиль текущего пользователя
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = Cookies.get("accessToken");
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Получаем профиль текущего пользователя согласно документации
        const response = await fetch(`${apiBase}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Ошибка получения профиля:", response.status);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Profile data:", data);

        // Маппим данные согласно новой структуре API
        const mappedProfile: UserProfile = {
          id: data.id,
          email: data.email,
          username: data.username,
          fullName: data.fullName,
          phone: data.phone,
          description: data.description,
          profilePictureUrl: data.profilePicture,
          teamId: data.team?.id,
          teamName: data.team?.name,
          teamCode: data.team?.code,
          teamSize: data.team?.members?.length || 0,
          teamLeader: data.team?.leaderId === data.id,
        };

        setProfile(mappedProfile);
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [apiBase]);

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

      {/* Команда */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-white">Команда</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.teamId ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Название команды
                  </p>
                  <p className="text-white font-medium">{profile.teamName}</p>
                </div>
                <a href="/team" className="text-accent hover:underline text-sm">
                  Открыть команду
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Код приглашения
                  </p>
                  <p className="text-white font-medium">
                    {profile.teamCode || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Количество участников
                  </p>
                  <p className="text-white font-medium">
                    {profile.teamSize ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Лидер</p>
                  <p className="text-white font-medium">
                    {profile.teamLeader ? "Да" : "Нет"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <TeamActionsNoTeam />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Локальный компонент действий, если пользователь без команды
const TeamActionsNoTeam = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError("Введите код команды");
      return;
    }
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";
      const res = await fetch(`${apiBase}/teams/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Ошибка входа в команду");
      }
      // Перезагрузить страницу профиля для обновления состояния команды
      window.location.reload();
    } catch (e) {
      setError("Не удалось присоединиться к команде");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Вы не состоите в команде
        </p>
        <a href="/team/create" className="text-accent hover:underline text-sm">
          Создать команду
        </a>
      </div>
      <form
        onSubmit={handleJoin}
        className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3"
      >
        <input
          className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
          placeholder="Код приглашения"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          className="bg-accent text-white rounded-md px-4 py-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти в команду"}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ProfileView;
