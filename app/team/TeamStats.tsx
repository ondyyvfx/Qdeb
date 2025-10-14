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

type TeamStatsProps = {
  team: TeamInfo;
};

// Моковые данные для демонстрации
const mockStats = {
  tournamentsParticipated: 8,
  wins: 5,
  losses: 3,
  winRate: 62.5,
  averageRating: 1785,
  totalPoints: 1250,
  achievements: [
    { name: "Первая победа", earned: "2024-01-20", icon: "🏆" },
    { name: "Стратег", earned: "2024-02-15", icon: "🎯" },
    { name: "Командная работа", earned: "2024-03-10", icon: "🤝" },
  ],
  recentTournaments: [
    { name: "Spring Debate 2024", place: 1, date: "2024-03-15", points: 150 },
    { name: "Logic Masters", place: 3, date: "2024-03-01", points: 100 },
    { name: "Winter Challenge", place: 2, date: "2024-02-20", points: 120 },
  ],
};

export default function TeamStats({ team }: TeamStatsProps) {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Турниров</p>
                <p className="text-3xl font-bold text-white">
                  {mockStats.tournamentsParticipated}
                </p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Побед</p>
                <p className="text-3xl font-bold text-white">
                  {mockStats.wins}
                </p>
              </div>
              <div className="text-3xl">🥇</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Рейтинг</p>
                <p className="text-3xl font-bold text-white">
                  {mockStats.averageRating}
                </p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">
                  Процент побед
                </p>
                <p className="text-3xl font-bold text-white">
                  {mockStats.winRate}%
                </p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Status */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-xl">📊</span>
              Статус команды
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Участников в команде</span>
                <span className="text-white font-medium">{team.size}/2</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-accent to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(team.size / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Готовность к турнирам</span>
                <span className="text-white font-medium">
                  {team.size === 2 ? "100%" : "50%"}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    team.size === 2
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-r from-yellow-500 to-yellow-600"
                  }`}
                  style={{ width: `${(team.size / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            {team.size < 2 && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Для участия в турнирах нужно 2 участника
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="text-xl">🏅</span>
              Достижения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStats.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium">{achievement.name}</p>
                    <p className="text-gray-400 text-sm">
                      Получено:{" "}
                      {new Date(achievement.earned).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tournaments */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-xl">🏆</span>
            Последние турниры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockStats.recentTournaments.map((tournament, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      tournament.place === 1
                        ? "bg-yellow-500"
                        : tournament.place === 2
                        ? "bg-gray-400"
                        : tournament.place === 3
                        ? "bg-orange-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {tournament.place}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tournament.name}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(tournament.date).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">+{tournament.points}</p>
                  <p className="text-gray-400 text-sm">очков</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <Button className="bg-accent hover:bg-accent/90 text-white">
              Посмотреть все турниры
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

