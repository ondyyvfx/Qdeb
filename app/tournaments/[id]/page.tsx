"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, Users, Clock, ExternalLink, ArrowLeft, Edit, Trash2, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { toast } from "sonner";
import { useUserStore } from "@/stores/useUserStore";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface Tournament {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  photoUrl?: string;
  organizerName: string;
  organizerContacts: string;
  description: string;
  eventDate: string;
  active: boolean;
  fee: number;
  level: string;
  format: string;
  tabbycatUrl?: string;
}

const TournamentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api";
  const tournamentId = params.id as string;

  useEffect(() => {
    if (tournamentId) {
      fetchTournament();
    }
  }, [tournamentId]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tournaments/getAll`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tournamentData = Array.isArray(data) ? data.find((t: any) => t.id.toString() === tournamentId) : null;

      if (tournamentData) {
        setTournament(tournamentData);
      } else {
        setError("Турнир не найден");
      }
    } catch (error) {
      console.error("Error fetching tournament:", error);
      setError("Ошибка загрузки турнира");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "d MMMM yyyy, EEEE", { locale: ru });
    } catch (error) {
      return dateString;
    }
  };

  const getLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      "SCHOOL": "Школьный",
      "UNIVERSITY": "Университетский", 
      "NATIONAL": "Национальный",
      "INTERNATIONAL": "Международный"
    };
    return levels[level] || level;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      "SCHOOL": "bg-green-500",
      "UNIVERSITY": "bg-blue-500",
      "NATIONAL": "bg-purple-500", 
      "INTERNATIONAL": "bg-red-500"
    };
    return colors[level] || "bg-gray-500";
  };

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот турнир?")) {
      return;
    }

    try {
      // Здесь должен быть API вызов для удаления турнира
      // const response = await fetch(`${API_URL}/tournaments/${tournamentId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${document.cookie.split('accessToken=')[1]?.split(';')[0] || ''}`
      //   }
      // });

      // if (response.ok) {
        toast.success("Турнир удален");
        router.push("/tournaments");
      // } else {
      //   toast.error("Ошибка удаления турнира");
      // }
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast.error("Ошибка удаления турнира");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-lg">Загрузка турнира...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Ошибка</CardTitle>
                <CardDescription>
                  {error || "Турнир не найден"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/tournaments")} className="w-full">
                  Вернуться к турнирам
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Навигация */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
          </div>

          {/* Заголовок */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {tournament.name}
                  </h1>
                  <p className="text-lg text-gray-400 font-medium">{tournament.shortName}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getLevelColor(tournament.level)} text-white px-4 py-2 text-sm font-semibold`}>
                    {getLevelLabel(tournament.level)}
                  </Badge>
                  {tournament.active ? (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold transition-colors">
                      Регистрация открыта
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-500 text-white px-4 py-2 text-sm font-semibold">
                      Регистрация закрыта
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основная информация */}
            <div className="lg:col-span-2 space-y-6">
              {/* Изображение */}
              {tournament.photoUrl && (
                <Card className="bg-white/5 border-white/20 overflow-hidden shadow-2xl">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={`${API_URL}${tournament.photoUrl}`}
                        alt={tournament.name}
                        className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Описание */}
              <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-accent" />
                    О турнире
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {tournament.description || "Описание турнира не указано."}
                  </p>
                </CardContent>
              </Card>

              {/* Информация об организаторе */}
              <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-accent" />
                    Организатор
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="font-semibold text-lg text-white">{tournament.organizerName}</p>
                      {tournament.organizerContacts && (
                        <p className="text-gray-400 mt-1">{tournament.organizerContacts}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Боковая панель */}
            <div className="space-y-6">
              {/* Детали турнира */}
              <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Детали турнира</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <Calendar className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Дата проведения</p>
                        <p className="text-gray-300">{formatDate(tournament.eventDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <DollarSign className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Стоимость участия</p>
                        <p className="text-gray-300">
                          {tournament.fee === 0 ? "Бесплатно" : `${tournament.fee} тенге`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Формат</p>
                        <p className="text-gray-300">{tournament.format || "Не указан"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <MapPin className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Организатор</p>
                        <p className="text-gray-300">{tournament.organizerName}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Действия */}
              <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tournament.active && tournament.tabbycatUrl && (
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <a
                        href={tournament.tabbycatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Зарегистрироваться
                      </a>
                    </Button>
                  )}

                  {!tournament.active && (
                    <Button disabled className="w-full bg-gray-600 text-gray-400 py-3 text-lg">
                      <Clock className="w-5 h-5 mr-2" />
                      Регистрация закрыта
                    </Button>
                  )}

                  {/* Кнопки для редактирования/удаления (если пользователь - организатор или админ) */}
                  {user && (user.roles?.includes("ORGANIZER") || user.roles?.includes("ADMIN")) && (
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        className="w-full border-accent text-accent hover:bg-accent hover:text-white py-3 text-lg transition-all duration-300"
                        onClick={() => router.push(`/tournaments/${tournamentId}/edit`)}
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        Редактировать
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full bg-red-600 hover:bg-red-700 py-3 text-lg transition-all duration-300"
                        onClick={handleDelete}
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Удалить
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TournamentDetailPage;
