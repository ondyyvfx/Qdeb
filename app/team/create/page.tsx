"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { apiGet } from "@/lib/api";
import Navbar from "@/components/shared/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdTeam, setCreatedTeam] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error("Введите название команды");
      return;
    }

    try {
      setLoading(true);

      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // JWT now sent via Authorization header
        body: JSON.stringify({ name: teamName }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const data = await res.json().catch(() => ({} as any));
          const message =
            data?.message || data?.detail || "Вы уже состоите в команде";
          toast.error(message);
          return;
        }
        const text = await res.text();
        toast.error(text || "Не удалось создать команду");
        return;
      }

      const data = await res.json();

      toast.success(`Команда "${data.name}" создана 🎉`);
      // Покажем код приглашения сразу после создания
      setCreatedTeam({ name: data.name, code: data.code });
      // Подтвердим, что создатель стал участником и лидером (бэк должен сделать это по токену)
      try {
        const me = await apiGet<any>("/auth/profile");
        if (me?.data?.teamId) {
          toast.success("Вы добавлены в команду и являетесь лидером");
        }
      } catch {}
    } catch (err: any) {
      toast.error(err?.message || "Что-то пошло не так при создании команды");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Создать команду</CardTitle>
          </CardHeader>
          <CardContent>
            {!createdTeam ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Введите название команды"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Создание..." : "Создать"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Команда создана:
                </p>
                <div className="bg-gray-900 border border-gray-700 rounded-md p-3">
                  <p className="text-white font-medium">{createdTeam.name}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Код приглашения
                      </p>
                      <p className="text-white font-semibold text-lg tracking-wider">
                        {createdTeam.code}
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(createdTeam.code);
                          toast.success("Код скопирован");
                        } catch {
                          toast.error("Не удалось скопировать код");
                        }
                      }}
                    >
                      Скопировать
                    </Button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/team")}
                  >
                    Перейти к команде
                  </Button>
                  <Button type="button" onClick={() => router.push("/profile")}>
                    К профилю
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
