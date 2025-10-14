"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet, apiPost } from "@/lib/api";
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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Получаем профиль, чтобы узнать команду пользователя
        const me = await apiGet<any>("/auth/profile");
        if (me.error) {
          setError(me.error);
          return;
        }
        const profile = me.data || {};
        if (!profile.teamId) {
          setError("Вы не состоите в команде");
          return;
        }
        setTeam({
          id: profile.teamId,
          name: profile.teamName,
          code: profile.teamCode,
          size: profile.teamSize,
          leader: !!profile.teamLeader,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLeave = async () => {
    const res = await apiPost("/teams/leave");
    if ((res as any).error) return;
    window.location.href = "/profile";
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
