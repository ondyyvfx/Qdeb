"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TeamInfo = {
  id: number;
  name: string;
  code: string;
  size: number;
  leader: boolean;
};

type TeamMembersProps = {
  team: TeamInfo;
};

// Моковые данные для демонстрации
const mockMembers = [
  {
    id: 1,
    username: "team_leader",
    fullName: "Александр Петров",
    email: "alex@example.com",
    role: "leader",
    joinedAt: "2024-01-15",
    tournamentsParticipated: 12,
    wins: 8,
    avgRating: 1850,
    isOnline: true,
    avatar: null,
  },
  {
    id: 2,
    username: "debater_pro",
    fullName: "Мария Сидорова",
    email: "maria@example.com",
    role: "member",
    joinedAt: "2024-02-20",
    tournamentsParticipated: 8,
    wins: 5,
    avgRating: 1720,
    isOnline: false,
    avatar: null,
  },
];

export default function TeamMembers({ team }: TeamMembersProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Участники команды</h2>
          <p className="text-gray-400 mt-1">
            {mockMembers.length} из 2 участников
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">
            {mockMembers.filter((m) => m.isOnline).length} онлайн
          </span>
        </div>
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockMembers.map((member) => (
          <Card
            key={member.id}
            className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {member.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {member.fullName}
                    </CardTitle>
                    <p className="text-gray-400 text-sm">@{member.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      member.role === "leader"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {member.role === "leader" ? "Лидер" : "Участник"}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-xl font-bold text-white">
                    {member.tournamentsParticipated}
                  </p>
                  <p className="text-xs text-gray-400">Турниров</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-xl font-bold text-white">{member.wins}</p>
                  <p className="text-xs text-gray-400">Побед</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-xl font-bold text-white">
                    {member.avgRating}
                  </p>
                  <p className="text-xs text-gray-400">Рейтинг</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{member.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">В команде с:</span>
                  <span className="text-white">
                    {new Date(member.joinedAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Статус:</span>
                  <span
                    className={`flex items-center gap-1 ${
                      member.isOnline ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        member.isOnline ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    {member.isOnline ? "Онлайн" : "Офлайн"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {member.role !== "leader" && (
                <div className="pt-4 border-t border-white/10">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30"
                  >
                    Удалить из команды
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Member Info */}
      {mockMembers.length < 2 && (
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">👥</div>
              <div>
                <h3 className="text-white font-medium mb-1">
                  Пригласите второго участника
                </h3>
                <p className="text-gray-400 text-sm">
                  Для участия в турнирах команда должна состоять из 2 участников
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <code className="bg-black/20 px-3 py-1 rounded text-white font-mono text-sm">
                    {team.code}
                  </code>
                  <Button
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(team.code)}
                    className="bg-accent hover:bg-accent/90"
                  >
                    Копировать код
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
