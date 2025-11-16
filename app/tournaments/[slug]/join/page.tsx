"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "react-hot-toast";
import { apiGet, apiPost } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import LoadingState from "@/components/shared/LoadingState";
import LoginRequiredMessage from "@/components/shared/LoginRequiredMessage";

interface RegistrationField {
  id?: number;
  name: string;
  type: string;
  required: boolean;
}

interface Tournament {
  id: number;
  name: string;
  slug: string;
  active: boolean;
  registrationFields?: RegistrationField[];
}

interface TeamUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

interface TeamInfo {
  id: number;
  name: string;
  memberCount: number;
}

const TournamentJoinPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isChecking, isNotLoggedIn, isAuthorized } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [team, setTeam] = useState<TeamInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const tournamentSlug = params.slug as string;

  // Загружаем данные только для авторизованных пользователей
  useEffect(() => {
    if (!isAuthorized) return;

    (async () => {
      try {
        setLoading(true);
        // Load tournament by slug using the correct API endpoint
        const tournamentResp = await apiGet<unknown>(
          `/tournaments/${tournamentSlug}`
        );
        if (tournamentResp.status !== 200 || !tournamentResp.data) {
          if (tournamentResp.status === 404) {
            throw new Error("Tournament not found");
          }
          throw new Error("Failed to load tournament");
        }

        const raw = tournamentResp.data as any;
        setTournament({
          id: raw?.id ?? 0,
          name: raw?.name ?? "",
          slug: raw?.slug ?? tournamentSlug,
          active: Boolean(raw?.active ?? true),
          registrationFields: raw?.registrationFields ?? [],
        });

        // Load my team
        const teamRes = await apiGet<TeamInfo>(`/teams/my`);
        if (teamRes.status === 200 && teamRes.data) {
          setTeam(teamRes.data as unknown as TeamInfo);
        } else {
          setTeam(null);
        }
      } catch (e) {
        console.error(e);
        toast.error("Не удалось загрузить данные турнира");
      } finally {
        setLoading(false);
      }
    })();
  }, [tournamentSlug, isAuthorized]);

  const canApply = useMemo(() => {
    if (!tournament?.active) return false;
    if (!team) return false;
    return team.memberCount === 2;
  }, [tournament, team]);

  const handleFieldChange = (name: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  const submitApplication = async () => {
    if (!tournament?.id || !team) return;

    // Required fields validation
    const required = (tournament.registrationFields || []).filter(
      (f) => f.required
    );
    for (const f of required) {
      if (!fieldValues[f.name] || !fieldValues[f.name].trim()) {
        toast.error(`Заполните обязательное поле: ${f.name}`);
        return;
      }
    }

    setSubmitting(true);
    const payload = {
      teamId: team.id,
      fields: (tournament.registrationFields || []).map((f) => ({
        name: f.name,
        value: fieldValues[f.name] ?? "",
      })),
    };

    const res = await apiPost<{ message: string; applicationId: number }>(
      `/tournaments/${tournament.id}/apply`,
      payload
    );
    setSubmitting(false);

    console.log("Application response:", {
      status: res.status,
      error: res.error,
      data: res.data,
    });

    if (res.status === 201 && res.data) {
      toast.success("Заявка отправлена");
      router.push(`/tournaments/${tournament.slug}`);
      return;
    }

    // Проверяем статус 403 или текст ошибки про лидера/капитана
    const errorMessage = res.error || "";
    const isLeaderError =
      res.status === 403 ||
      errorMessage.toLowerCase().includes("лидер") ||
      errorMessage.toLowerCase().includes("leader") ||
      errorMessage.toLowerCase().includes("капитан") ||
      errorMessage.toLowerCase().includes("captain") ||
      errorMessage.toLowerCase().includes("только лидер");

    if (isLeaderError) {
      toast.error(
        "Только лидер команды может подавать заявки на турниры. Попросите лидера команды подать заявку."
      );
    } else {
      toast.error(errorMessage || "Не удалось отправить заявку");
    }
  };

  // Показываем состояние загрузки при проверке авторизации
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background text-text">
        <Toaster position="top-center" />
        <Navbar />
        <LoadingState message="Проверка авторизации..." />
        <Footer />
      </div>
    );
  }

  // Показываем сообщение о необходимости авторизации
  if (isNotLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-text">
        <Toaster position="top-center" />
        <Navbar />
        <LoginRequiredMessage message="Необходимо войти в систему для подачи заявки на участие в турнире" />
        <Footer />
      </div>
    );
  }

  // Показываем содержимое страницы только для авторизованных пользователей
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <Toaster position="top-center" />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Подача заявки
              </CardTitle>
              <CardDescription>
                {tournament ? `Турнир: ${tournament.name}` : "Загрузка турнира"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && <div className="text-gray-300">Загрузка...</div>}
              {!loading && !tournament && (
                <div className="text-red-400">Турнир не найден</div>
              )}
              {!loading && tournament && (
                <>
                  {!team && (
                    <div className="text-amber-400 text-sm">
                      Вы не состоите в команде. Создайте или вступите в команду
                      перед подачей заявки.
                    </div>
                  )}
                  {team && team.memberCount !== 2 && (
                    <div className="text-amber-400 text-sm">
                      Заявку может подать только команда из 2 участников.
                      Сейчас: {team.memberCount}/2
                    </div>
                  )}
                  <div className="rounded-md border border-white/10 p-3 text-sm text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>Команда</span>
                      <span className="font-semibold text-white">
                        {team ? `${team.name} (${team.memberCount}/2)` : "—"}
                      </span>
                    </div>
                  </div>

                  {(tournament.registrationFields || []).map((f) => (
                    <div key={f.name} className="space-y-1">
                      <Label
                        className="text-sm text-gray-300"
                        htmlFor={`field-${f.name}`}
                      >
                        {f.name}
                        {f.required && <span className="text-red-400"> *</span>}
                      </Label>
                      <Input
                        id={`field-${f.name}`}
                        placeholder={f.name}
                        value={fieldValues[f.name] || ""}
                        onChange={(e) =>
                          handleFieldChange(f.name, e.target.value)
                        }
                      />
                    </div>
                  ))}

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/tournaments/${tournament.slug}`)
                      }
                      className="border-white/20"
                    >
                      Назад
                    </Button>
                    <Button
                      onClick={submitApplication}
                      disabled={!canApply || submitting}
                    >
                      {submitting ? "Отправка..." : "Отправить заявку"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TournamentJoinPage;
