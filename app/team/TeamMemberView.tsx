"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type TeamInfo = {
  id: number;
  name: string;
  code: string;
  size: number;
  leader: boolean;
};

type TeamMemberViewProps = {
  team: TeamInfo;
  onLeave: () => void;
};

const TEAM_CAPACITY = 2;

export default function TeamMemberView({ team, onLeave }: TeamMemberViewProps) {
  const memberCount = Math.max(team.size, 1);
  const readiness = Math.min(
    100,
    Math.round((memberCount / TEAM_CAPACITY) * 100)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Основная информация */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Информация о команде
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Код приглашения</p>
                <p className="text-white font-medium text-lg">{team.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">
                  Участников в команде
                </p>
                <p className="text-white font-medium text-lg">
                  {memberCount}/{TEAM_CAPACITY}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-2">Ваша роль</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white">Участник команды</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Статистика команды
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-gray-400">Турниров</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-gray-400">Побед</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Готовность команды</span>
                <span className="text-white font-medium">{readiness}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-accent to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${readiness}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10 mt-8">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            Формы и заявки
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-300">
          <p>
            Если лидер команды поделился формой или анкетой, перейдите по ссылке ниже, чтобы ее заполнить.
            Ответы помогут организаторам быстрее обработать вашу заявку.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-white">
            <Link href="/registration-form">Перейти к форме</Link>
          </Button>
        </CardContent>
      </Card>


      {/* Действия */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={onLeave}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
        >
          Покинуть команду
        </Button>
      </div>
    </div>
  );
}
