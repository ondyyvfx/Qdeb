"use client";

import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api";
import { toast } from "react-hot-toast";

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

type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

type ApplicationSummary = {
  id: number;
  status: ApplicationStatus;
};

type MemberSummary = {
  id: string;
  username?: string;
  fullName?: string;
  email?: string;
  role: "leader" | "member";
  joinedAt?: string | null;
  note?: string;
  isSelf?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

export default function TeamMembers({ team }: TeamMembersProps) {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [hasActiveApplication, setHasActiveApplication] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        setApplicationsLoading(true);
        setHasActiveApplication(false);

        const token = Cookies.get("accessToken");
        if (!token) {
          setError("Не удалось определить текущего пользователя.");
          setMembers([]);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [profileRes, teamRes] = await Promise.all([
          fetch(`${API_URL}/profile`, { headers }),
          fetch(`${API_URL}/teams/my`, { headers }),
        ]);

        if (!profileRes.ok) {
          throw new Error("Не удалось получить информацию о профиле.");
        }

        const profileData = await profileRes.json();
        const teamData = teamRes.ok ? await teamRes.json() : null;

        const collected = new Map<string, MemberSummary>();
        let rosterLocked = false;

        // Лидер команды (если пришёл из API)
        if (teamData?.leader) {
          const leader: MemberSummary = {
            id: String(teamData.leader.id),
            username: teamData.leader.username,
            fullName: teamData.leader.fullName ?? teamData.leader.username,
            email: teamData.leader.email,
            role: "leader",
            joinedAt: teamData.createdAt ?? null,
            note: teamData.leader.id === profileData.id ? "Это вы" : undefined,
          };
          collected.set(leader.id, leader);
        }

        // Текущий пользователь
        const currentUser: MemberSummary = {
          id: String(profileData.id),
          username: profileData.username,
          fullName: profileData.fullName,
          email: profileData.email,
          role: profileData.team?.role === "LEADER" ? "leader" : "member",
          joinedAt: profileData.team?.joinedAt ?? null,
          note: "Это вы",
          isSelf: true,
        };
        collected.set(currentUser.id, currentUser);

        // Второй участник (если известен только ID)
        const teammateId = profileData.team?.memberId;
        if (teammateId && !collected.has(String(teammateId)) && team.size > 1) {
          collected.set(String(teammateId), {
            id: String(teammateId),
            role: "member",
            note: "Информация об участнике появится после подключения профиля.",
          });
        }

        setMembers(Array.from(collected.values()));

        if (team.id) {
          try {
            const applicationsRes = await fetch(
              `${API_URL}/teams/${team.id}/applications`,
              {
                headers,
              }
            );

            if (applicationsRes.ok) {
              let applicationData: ApplicationSummary[] = [];
              if (applicationsRes.status !== 204) {
                applicationData =
                  (await applicationsRes.json()) as ApplicationSummary[];
              }

              rosterLocked = Array.isArray(applicationData)
                ? applicationData.some(
                    (application) =>
                      application.status === "PENDING" ||
                      application.status === "APPROVED"
                  )
                : false;
            } else if (applicationsRes.status !== 404) {
              console.error(
                "Не удалось получить заявки команды:",
                applicationsRes.status
              );
            }
          } catch (applicationsError) {
            console.error(
              "Ошибка загрузки статуса заявок команды:",
              applicationsError
            );
          }
        }

        setHasActiveApplication(rosterLocked);
        if (rosterLocked) {
          setLeaveError(null);
        }
      } catch (err) {
        console.error("Ошибка загрузки состава команды:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить участников команды."
        );
        setMembers([]);
        setHasActiveApplication(false);
      } finally {
        setLoading(false);
        setApplicationsLoading(false);
      }
    };

    loadMembers();
  }, [team.id]);

  const memberLimit = 2;
  const joinedCount = useMemo(
    () => Math.max(team.size, members.length),
    [team.size, members.length]
  );
  const freeSlots = useMemo(
    () => Math.max(0, memberLimit - joinedCount),
    [memberLimit, joinedCount]
  );

  const isLeaveButtonDisabled =
    applicationsLoading || hasActiveApplication || leaveLoading;

  const handleLeaveTeam = async () => {
    if (applicationsLoading || hasActiveApplication || leaveLoading) {
      return;
    }

    try {
      setLeaveLoading(true);
      setLeaveError(null);

      const response = await apiPost<unknown>("/teams/leave");

      if (response.status >= 200 && response.status < 300) {
        toast.success("Вы покинули команду");
        window.location.href = "/team";
        return;
      }

      const message = response.error || "Не удалось покинуть команду";
      setLeaveError(message);
      toast.error(message);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Не удалось покинуть команду";
      setLeaveError(message);
      toast.error(message);
    } finally {
      setLeaveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Состав команды</h2>
          <p className="text-gray-400 mt-1">
            {joinedCount} из {memberLimit} участников
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end sm:text-right">
          <Button
            onClick={handleLeaveTeam}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLeaveButtonDisabled}
          >
            {leaveLoading ? "Выходим..." : "Покинуть команду"}
          </Button>
          {applicationsLoading && (
            <span className="text-xs text-gray-400">
              Проверяем активные заявки...
            </span>
          )}
          {!applicationsLoading && hasActiveApplication && (
            <span className="text-xs text-amber-300 max-w-xs">
              После подачи заявки на турнир состав команды фиксируется до
              завершения обработки заявки.
            </span>
          )}
          {leaveError && !hasActiveApplication && (
            <span className="text-xs text-red-400 max-w-xs">{leaveError}</span>
          )}
        </div>
      </div>

      {loading ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-sm text-gray-400">
            Загрузка состава команды...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6 text-sm text-red-300">
            {error}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {members.map((member) => (
            <Card
              key={member.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-white text-lg">
                      {member.fullName ?? "Участник команды"}
                    </CardTitle>
                    <p className="text-gray-400 text-sm">
                      {member.username
                        ? `@${member.username}`
                        : "логин недоступен"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      member.role === "leader"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
                    {member.role === "leader" ? "Лидер" : "Участник"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="text-white">
                    {member.fullName ?? "Участник команды"}
                  </p>
                  <p className="text-gray-400">
                    {member.username
                      ? `@${member.username}`
                      : "логин недоступен"}
                  </p>
                  <p className="text-gray-300">
                    {member.role === "leader" ? "Лидер" : "Участник"}
                  </p>
                </div>
                <div className="space-y-1 text-gray-300">
                  <p>
                    Email{" "}
                    <span className="text-white">
                      {member.email ?? "не указан"}
                    </span>
                  </p>
                  <p>
                    Дата присоединения{" "}
                    <span className="text-white">
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString("ru-RU")
                        : "недоступно"}
                    </span>
                  </p>
                </div>
                {member.note && (
                  <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
                    {member.note}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {freeSlots > 0 && (
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6 space-y-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-white font-medium">
                До полного состава осталось {freeSlots}
                {freeSlots === 1 ? " место" : " места"}
              </h3>
              <p className="text-gray-400 text-sm">
                Поделитесь кодом, чтобы пригласить нового участника.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <code className="bg-black/30 px-3 py-1 rounded text-white font-mono text-sm">
                  {team.code}
                </code>
                <Button
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(team.code)}
                  className="bg-accent hover:bg-accent/90"
                >
                  Скопировать
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
