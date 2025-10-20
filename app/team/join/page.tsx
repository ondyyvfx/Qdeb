"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";

interface TeamUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  profilePicture?: string | null;
}

interface TeamInfo {
  id: number;
  name: string;
  joinCode: string;
  leader?: TeamUser | null;
  member?: TeamUser | null;
  memberCount: number;
  isFull: boolean;
}

const JoinTeamPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [team, setTeam] = useState<TeamInfo | null>(null);

  useEffect(() => {
    (async () => {
      const res = await apiGet<TeamInfo>("/teams/my");
      if (res.status === 200 && res.data) {
        setTeam(res.data as unknown as TeamInfo);
      } else {
        setTeam(null);
      }
      setLoading(false);
    })();
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error("Введите код приглашения команды");
      return;
    }
    setSubmitting(true);
    const res = await apiPost<TeamInfo>("/teams/join", { joinCode: joinCode.trim() });
    setSubmitting(false);
    if (res.status === 200 && res.data) {
      toast.success("Вы присоединились к команде");
      router.push("/team");
    } else {
      toast.error(res.error || "Не удалось присоединиться к команде");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-xl mx-auto">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Присоединиться к команде</CardTitle>
              <CardDescription>Введите код приглашения для вступления</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 text-center text-gray-300">Загрузка...</div>
              ) : team ? (
                <div className="space-y-3">
                  <p className="text-gray-200">Вы уже состоите в команде:</p>
                  <div className="rounded-md border border-white/10 p-3">
                    <div className="text-white font-semibold">{team.name}</div>
                    <div className="text-sm text-gray-300">Участников: {team.memberCount}/2</div>
                  </div>
                  <div className="pt-2">
                    <Button onClick={() => router.push("/team")} className="w-full">Перейти в команду</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleJoin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinCode">Код приглашения</Label>
                    <Input
                      id="joinCode"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Например: ABC12345"
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Присоединяем..." : "Присоединиться"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JoinTeamPage;


