"use client";

import Image from "next/image";
import { useUserStore } from "@/stores/useUserStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import Cookies from "js-cookie";
import { resolveProfilePictureUrl } from "@/lib/profilePicture";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const user = useUserStore((state) => state.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const apiBase =
    (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:4232/api";

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

        // Получаем профиль текущего пользователя
        const profileResponse = await fetch(`${apiBase}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          credentials: "include",
        });

        if (!profileResponse.ok) {
          console.error("Ошибка получения профиля:", profileResponse.status);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const profileData = await profileResponse.json();
        console.log("Profile data:", profileData);

        let teamData = null;

        // Получаем данные команды отдельно через специальный эндпоинт
        try {
          const teamResponse = await fetch(`${apiBase}/teams/my`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors",
            credentials: "include",
          });

          if (teamResponse.ok) {
            teamData = await teamResponse.json();
            console.log("Team data:", teamData);
          }
        } catch (teamError) {
          console.log(
            "Пользователь не состоит в команде или ошибка получения команды:",
            teamError
          );
        }

        // Маппим данные профиля
        const mappedProfile: UserProfile = {
          id: profileData.id,
          email: profileData.email,
          username: profileData.username,
          fullName: profileData.fullName,
          phone: profileData.phone,
          description: profileData.description,
          profilePictureUrl: profileData.profilePicture,
          // Используем данные команды из специального эндпоинта
          teamId: teamData?.id,
          teamName: teamData?.name,
          teamCode: teamData?.joinCode,
          teamSize: teamData?.memberCount || 0,
          teamLeader: teamData?.leader?.id === profileData.id,
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
          <p className="mt-4 text-lg">{t.profile.loadingProfile}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-background shadow-2xl rounded-2xl mt-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            {t.profile.userNotFound}
          </h1>
          <p className="mt-2 text-gray-400">{t.profile.loginToView}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-background shadow-2xl rounded-2xl mt-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            {t.profile.profileNotFound}
          </h1>
          <p className="mt-2 text-gray-400">{t.profile.couldNotLoad}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-background shadow-2xl rounded-2xl mt-8 flex flex-col gap-8">
      {/* Заголовок профиля */}
      <div className="flex items-center gap-10">
        {resolveProfilePictureUrl(profile.profilePictureUrl) || user?.avatar ? (
          <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-secondary shadow-lg">
            <Image
              src={
                resolveProfilePictureUrl(profile.profilePictureUrl) ||
                (user?.avatar as string)
              }
              alt="User avatar"
              fill
              className="object-cover"
              unoptimized
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
              (profile.email
                ? profile.email.split("@")[0]
                : t.profile.userFallback)}
          </h1>
          <p className="text-lg text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      {/* Основная информация */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-white">
            {t.profile.basicInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{t.profile.email}</p>
            <p className="text-white font-medium">
              {profile.email || t.profile.notSpecifiedM}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t.profile.fullName}</p>
            <p className="text-white font-medium">
              {profile.fullName || t.profile.notSpecifiedN}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{t.profile.phone}</p>
            <p className="text-white font-medium">
              {profile.phone || t.profile.notSpecifiedM}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              {t.profile.loginUsername}
            </p>
            <p className="text-white font-medium">
              {profile.username ||
                (profile.email
                  ? profile.email.split("@")[0]
                  : t.profile.notSpecifiedM)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Команда */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-white">{t.profile.team}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.teamId ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profile.teamName}
                  </p>
                  <p className="text-white font-medium">{profile.teamName}</p>
                </div>
                <a href="/team" className="text-accent hover:underline text-sm">
                  {t.profile.openTeam}
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profile.inviteCode}
                  </p>
                  <p className="text-white font-medium">
                    {profile.teamCode || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profile.membersCount}
                  </p>
                  <p className="text-white font-medium">
                    {profile.teamSize ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t.profile.leader}
                  </p>
                  <p className="text-white font-medium">
                    {profile.teamLeader ? t.profile.yes : t.profile.no}
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
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError(t.profile.enterTeamCode);
      return;
    }
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";
      const requestBody = {
        joinCode: code.trim(),
      };

      console.log("Joining team with request body:", requestBody);

      const res = await fetch(`${apiBase}/teams/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
        mode: "cors",
        credentials: "include",
      });

      console.log("Join team response status:", res.status);

      if (!res.ok) {
        let errorMessage = t.profile.couldNotJoin;
        try {
          const errorData = await res.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          console.error("Ошибка парсинга ответа:", e);
        }
        throw new Error(errorMessage);
      }
      // Перезагрузить страницу профиля для обновления состояния команды
      window.location.reload();
    } catch (e) {
      setError(t.profile.couldNotJoin);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t.profile.noTeam}</p>
        <a href="/team/create" className="text-accent hover:underline text-sm">
          {t.profile.createTeam}
        </a>
      </div>
      <form
        onSubmit={handleJoin}
        className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3"
      >
        <input
          className="bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white"
          placeholder={t.profile.inviteCode}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          className="bg-accent text-white rounded-md px-4 py-2 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? t.profile.joining : t.profile.joinTeam}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ProfileView;
