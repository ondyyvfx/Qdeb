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

interface RegistrationField {
  id?: number;
  name: string;
  type: string;
  required: boolean;
}

interface Tournament {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  imageUrl?: string;
  organizerName: string;
  organizerContact: string;
  description: string;
  date: string;
  active: boolean;
  fee: number;
  level: string;
  format: string;
  tabbycatUrl?: string;
  registrationFields?: RegistrationField[];
}

const TournamentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";
  const assetsBase = API_URL.replace(/\/api$/, "");
  const tournamentSlug = params.slug as string;

  useEffect(() => {
    if (tournamentSlug) {
      fetchTournament();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentSlug]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tournaments`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Unexpected response format");
      }

      const data: any = await response.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.results)
        ? (data as any).results
        : [];

      const raw = list.find((item: any) => {
        const rawSlug = item?.slug || item?.tournamentSlug || String(item?.id ?? "");
        return rawSlug?.toString().toLowerCase() === tournamentSlug.toLowerCase();
      });

      if (!raw) {
        setError("Tournament not found.");
        setTournament(null);
        return;
      }

      const normalized: Tournament = {
        id: raw?.id ?? 0,
        name: raw?.name ?? "",
        shortName: raw?.shortName ?? raw?.name ?? "",
        slug: raw?.slug ?? raw?.tournamentSlug ?? String(raw?.id ?? tournamentSlug),
        imageUrl: raw?.imageURL || raw?.photoUrl || raw?.tournamentPicture || undefined,
        organizerName: raw?.organizerName ?? "",
        organizerContact: raw?.organizerContact ?? raw?.organizerContacts ?? "",
        description: raw?.description ?? "",
        date: raw?.date ?? raw?.eventDate ?? "",
        active: Boolean(raw?.active ?? true),
        fee:
          typeof raw?.fee === "number"
            ? raw.fee
            : Number.parseFloat(raw?.fee ?? "0") || 0,
        level: raw?.level ?? "",
        format: raw?.format ?? "",
        tabbycatUrl: raw?.tabbycatUrl ?? raw?.registrationLink ?? undefined,
        registrationFields: raw?.registrationFields ?? [],
      };

      setTournament(normalized);
      setError(null);
    } catch (err) {
      console.error("Error fetching tournament:", err);
      setError("Failed to load tournament data.");
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
      LOCAL: "Местный",
      REGIONAL: "Региональный",
      NATIONAL: "Национальный",
      INTERNATIONAL: "Международный",
    };
    return levels[level] || level;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      LOCAL: "bg-blue-500",
      REGIONAL: "bg-purple-500",
      NATIONAL: "bg-amber-500",
      INTERNATIONAL: "bg-red-500",
    };
    return colors[level] || "bg-gray-500";
  };

  const handleDelete = async () => {
    toast.info("Удаление турнира пока не реализовано");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
            <p className="text-lg">Загрузка информации о турнире...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Ошибка</CardTitle>
              <CardDescription>{error || "Tournament not found."}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/tournaments")}>Вернуться к списку</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Button>

          <Card className="bg-white/5 border-white/10 shadow-xl">
            <CardContent className="p-6 md:p-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{tournament.name}</h1>
                  {tournament.shortName && (
                    <p className="text-lg text-gray-400">{tournament.shortName}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getLevelColor(tournament.level)} text-white px-4 py-2 text-sm font-semibold`}>
                    {getLevelLabel(tournament.level)}
                  </Badge>
                  <Badge variant={tournament.active ? "default" : "secondary"} className="px-4 py-2 text-sm font-semibold">
                    {tournament.active ? "Регистрация открыта" : "Регистрация закрыта"}
                  </Badge>
                </div>
              </div>

              <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-line">
                {tournament.description || "Описание появится позже."}
              </p>

              {tournament.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={tournament.imageUrl.startsWith("http") ? tournament.imageUrl : `${assetsBase}${tournament.imageUrl}`}
                    alt={tournament.name}
                    className="w-full h-80 object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">Информация</CardTitle>
                  <CardDescription>Основные данные о турнире</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-400">Дата</p>
                        <p className="text-base text-white">{formatDate(tournament.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-400">Взнос</p>
                        <p className="text-base text-white">
                          {tournament.fee === 0 ? "Бесплатно" : `${tournament.fee} ₸`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-400">Формат</p>
                        <p className="text-base text-white">{tournament.format || "Уточняется"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-400">Организатор</p>
                        <p className="text-base text-white">{tournament.organizerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm text-gray-400">Контакты</p>
                        <p className="text-base text-white">{tournament.organizerContact}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {tournament.registrationFields && tournament.registrationFields.length > 0 && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white">Поля регистрации</CardTitle>
                    <CardDescription>Какие данные нужно будет указать при подаче заявки</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tournament.registrationFields.map((field, index) => (
                      <div
                        key={field.id ?? index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <div>
                          <p className="text-base text-white font-medium">{field.name}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">{field.type}</p>
                        </div>
                        <Badge variant={field.required ? "default" : "secondary"}>
                          {field.required ? "Обязательно" : "Опционально"}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">Действия</CardTitle>
                  <CardDescription>Ссылки и управляющие кнопки</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tournament.active && tournament.tabbycatUrl ? (
                    <Button asChild className="w-full bg-accent hover:bg-accent/90 text-white">
                      <a href={tournament.tabbycatUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="w-5 h-5" />
                        Регистрация на Tabbycat
                      </a>
                    </Button>
                  ) : (
                    <Button disabled className="w-full bg-gray-600 text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      Регистрация закрыта
                    </Button>
                  )}

                  {user?.roles?.includes("ROLE_ADMIN") && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <Button
                        variant="outline"
                        className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                        onClick={() => router.push(`/tournaments/${tournamentSlug}/edit`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Редактировать
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleDelete}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
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
