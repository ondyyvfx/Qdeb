"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";

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
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [team, setTeam] = useState<TeamInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const tournamentSlug = params.slug as string;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Load tournaments via authorized API helper and pick by slug
        const listResp = await apiGet<unknown>(`/tournaments`);
        if (listResp.status !== 200 || !listResp.data) {
          throw new Error("Failed to load tournaments");
        }
        const data = listResp.data as any;
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.results)
          ? (data as any).results
          : [];
        const raw = (list as any[]).find((item) => {
          const rawSlug = item?.slug || item?.tournamentSlug || String(item?.id ?? "");
          return rawSlug?.toString().toLowerCase() === tournamentSlug.toLowerCase();
        });
        if (!raw) throw new Error("Tournament not found");

        setTournament({
          id: raw?.id ?? 0,
          name: raw?.name ?? "",
          slug: raw?.slug ?? raw?.tournamentSlug ?? String(raw?.id ?? tournamentSlug),
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
  }, [tournamentSlug]);

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
    const required = (tournament.registrationFields || []).filter((f) => f.required);
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

    if (res.status === 201 && res.data) {
      toast.success("Заявка отправлена");
      router.push(`/tournaments/${tournament.slug}`);
    } else {
      toast.error(res.error || "Не удалось отправить заявку");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Подача заявки</CardTitle>
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
                      Вы не состоите в команде. Создайте или вступите в команду перед подачей заявки.
                    </div>
                  )}
                  {team && team.memberCount !== 2 && (
                    <div className="text-amber-400 text-sm">
                      Заявку может подать только команда из 2 участников. Сейчас: {team.memberCount}/2
                    </div>
                  )}
                  <div className="rounded-md border border-white/10 p-3 text-sm text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>Команда</span>
                      <span className="font-semibold text-white">{team ? `${team.name} (${team.memberCount}/2)` : "—"}</span>
                    </div>
                  </div>

                  {(tournament.registrationFields || []).map((f) => (
                    <div key={f.name} className="space-y-1">
                      <Label className="text-sm text-gray-300" htmlFor={`field-${f.name}`}>
                        {f.name}
                        {f.required && <span className="text-red-400"> *</span>}
                      </Label>
                      <Input
                        id={`field-${f.name}`}
                        placeholder={f.name}
                        value={fieldValues[f.name] || ""}
                        onChange={(e) => handleFieldChange(f.name, e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/tournaments/${tournament.slug}`)}
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


