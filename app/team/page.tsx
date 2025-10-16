"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import TeamDashboard from "./TeamDashboard";
import TeamMemberView from "./TeamMemberView";

type TeamInfo = {
  id: number;
  name: string;
  code: string;
  size: number;
  leader: boolean;
};

export default function TeamPage() {
  const [team, setTeam] = useState<TeamInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const token = Cookies.get("accessToken");
        if (!token) {
          setError("Необходимо войти в систему");
          return;
        }

        // Получаем информацию о команде через специальный эндпоинт
        const response = await fetch(`${API_URL}/teams/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 400) {
            setError("Вы не состоите в команде");
            return;
          }
          setError("Ошибка получения данных команды");
          return;
        }

        const teamData = await response.json();
        console.log("Team data:", teamData);

        // Получаем ID текущего пользователя из токена для проверки лидерства
        let currentUserId = null;
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          currentUserId = tokenPayload.sub || tokenPayload.id;
        } catch (e) {
          console.error("Ошибка парсинга токена:", e);
        }

        setTeam({
          id: teamData.id,
          name: teamData.name,
          code: teamData.joinCode,
          size: teamData.memberCount || 0,
          leader: teamData.leader?.id === currentUserId, // Проверяем, является ли текущий пользователь лидером
        });
      } catch (error) {
        console.error("Ошибка загрузки команды:", error);
        setError("Ошибка загрузки данных команды");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [API_URL]);

  const handleLeave = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`${API_URL}/teams/leave`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка выхода из команды:", errorData);
        return;
      }

      window.location.href = "/profile";
    } catch (error) {
      console.error("Ошибка при выходе из команды:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!team) return null;

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-white/10 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {team.name}
            </h1>
            <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto">
              {team.leader
                ? "Панель управления командой"
                : "Информация о команде"}
            </p>
          </div>
        </div>

        {/* Main Content */}
        {team.leader ? (
          <TeamDashboard team={team} />
        ) : (
          <TeamMemberView team={team} onLeave={handleLeave} />
        )}
      </div>
      <Footer />
    </div>
  );
}
