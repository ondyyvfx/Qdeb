"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet, apiPost } from "@/lib/api";

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
    <div className="max-w-3xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Команда: {team.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Код приглашения</p>
              <p className="text-white font-medium">{team.code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Количество участников
              </p>
              <p className="text-white font-medium">{team.size}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Вы лидер</p>
              <p className="text-white font-medium">
                {team.leader ? "Да" : "Нет"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <a
              href="/team/create"
              className="bg-accent text-white px-4 py-2 rounded-md"
            >
              Создать команду
            </a>
            <button
              onClick={handleLeave}
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Покинуть команду
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
