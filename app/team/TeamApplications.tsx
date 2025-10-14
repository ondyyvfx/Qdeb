"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TeamInfo = {
  id: number;
  name: string;
  code: string;
  size: number;
  leader: boolean;
};

type TeamApplicationsProps = {
  team: TeamInfo;
};

type Application = {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  message?: string;
  appliedAt: string;
  rating: number;
  tournamentsParticipated: number;
  wins: number;
  avatar?: string;
};

// Моковые данные для демонстрации
const mockApplications: Application[] = [
  {
    id: 1,
    userId: 101,
    username: "debate_master",
    fullName: "Екатерина Волкова",
    email: "kate@example.com",
    message:
      "Привет! Я опытный дебатер с 3 годами практики. Хотела бы присоединиться к вашей команде для участия в турнирах.",
    appliedAt: "2024-03-15T10:30:00Z",
    rating: 1920,
    tournamentsParticipated: 15,
    wins: 11,
  },
  {
    id: 2,
    userId: 102,
    username: "logic_king",
    fullName: "Дмитрий Козлов",
    email: "dmitry@example.com",
    message: "Интересует участие в турнирах. Есть опыт в WSDC формате.",
    appliedAt: "2024-03-14T15:45:00Z",
    rating: 1680,
    tournamentsParticipated: 8,
    wins: 4,
  },
  {
    id: 3,
    userId: 103,
    username: "speech_queen",
    fullName: "Анна Смирнова",
    email: "anna@example.com",
    appliedAt: "2024-03-13T09:15:00Z",
    rating: 1750,
    tournamentsParticipated: 12,
    wins: 7,
  },
];

export default function TeamApplications({ team }: TeamApplicationsProps) {
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [processing, setProcessing] = useState<number | null>(null);

  const handleAccept = async (applicationId: number) => {
    setProcessing(applicationId);
    // Здесь будет API вызов для принятия заявки
    setTimeout(() => {
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      setProcessing(null);
    }, 1000);
  };

  const handleReject = async (applicationId: number) => {
    setProcessing(applicationId);
    // Здесь будет API вызов для отклонения заявки
    setTimeout(() => {
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      setProcessing(null);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Вчера";
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Заявки на вступление
          </h2>
          <p className="text-gray-400 mt-1">
            {applications.length} заявок ожидают рассмотрения
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          <span className="text-orange-400 text-sm font-medium">
            Требуют внимания
          </span>
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-white mb-2">
              Нет новых заявок
            </h3>
            <p className="text-gray-400">
              Когда кто-то подаст заявку на вступление в команду, она появится
              здесь
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {application.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">
                        {application.fullName}
                      </CardTitle>
                      <p className="text-gray-400">@{application.username}</p>
                      <p className="text-gray-500 text-sm">
                        {application.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                      {formatDate(application.appliedAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Message */}
                {application.message && (
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-white text-sm leading-relaxed">
                      {application.message}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-lg font-bold text-white">
                      {application.rating}
                    </p>
                    <p className="text-xs text-gray-400">Рейтинг</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-lg font-bold text-white">
                      {application.tournamentsParticipated}
                    </p>
                    <p className="text-xs text-gray-400">Турниров</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-lg font-bold text-white">
                      {application.wins}
                    </p>
                    <p className="text-xs text-gray-400">Побед</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => handleAccept(application.id)}
                    disabled={processing === application.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processing === application.id ? "Принимаем..." : "Принять"}
                  </Button>
                  <Button
                    onClick={() => handleReject(application.id)}
                    disabled={processing === application.id}
                    variant="destructive"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {processing === application.id
                      ? "Отклоняем..."
                      : "Отклонить"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="text-white font-medium mb-2">
                Как работают заявки?
              </h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Пользователи подают заявки на вступление в команду</li>
                <li>
                  • Только лидер команды может принимать или отклонять заявки
                </li>
                <li>• Команда может состоять максимум из 2 участников</li>
                <li>
                  • После принятия заявки пользователь становится полноправным
                  участником
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

