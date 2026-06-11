"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Navbar from "@/components/shared/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

export default function CreateTeamPage() {
  const { t } = useLanguage();
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
      toast.error(t.team.enterTeamName);
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
            data?.message || data?.detail || t.team.alreadyInTeam;
          toast.error(message);
          return;
        }
        const text = await res.text();
        toast.error(text || t.team.couldNotCreate);
        return;
      }

      const data = await res.json();

      toast.success(t.team.teamCreated(data.name));
      // Покажем код приглашения сразу после создания
      setCreatedTeam({ name: data.name, code: data.joinCode });
      // Подтвердим, что создатель стал участником и лидером (бэк должен сделать это по токену)
      try {
        const token = Cookies.get("accessToken");
        const profileResponse = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.team?.id) {
            toast.success(t.team.addedAsLeader);
          }
        }
      } catch {}
    } catch (err: any) {
      toast.error(err?.message || t.team.createError);
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
            <CardTitle className="text-xl">{t.team.createButton}</CardTitle>
          </CardHeader>
          <CardContent>
            {!createdTeam ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder={t.team.enterTeamName}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t.team.creating : t.team.create}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t.team.teamCreatedLabel}
                </p>
                <div className="bg-gray-900 border border-gray-700 rounded-md p-3">
                  <p className="text-white font-medium">{createdTeam.name}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t.team.inviteCodeShort}
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
                          toast.success(t.team.codeCopied);
                        } catch {
                          toast.error(t.team.couldNotCopy);
                        }
                      }}
                    >
                      {t.team.copy}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/team")}
                  >
                    {t.team.goToTeam}
                  </Button>
                  <Button type="button" onClick={() => router.push("/profile")}>
                    {t.team.toProfile}
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

