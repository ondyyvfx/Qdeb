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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
      toast.error(t.team.enterCodeError);
      return;
    }
    setSubmitting(true);
    const res = await apiPost<TeamInfo>("/teams/join", { joinCode: joinCode.trim() });
    setSubmitting(false);
    if (res.status === 200 && res.data) {
      toast.success(t.team.joinedSuccess);
      router.push("/team");
    } else {
      toast.error(res.error || t.team.joinFailed);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-xl mx-auto">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white">{t.team.joinTitle}</CardTitle>
              <CardDescription>{t.team.joinDescriptionShort}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 text-center text-gray-300">{t.team.loading}</div>
              ) : team ? (
                <div className="space-y-3">
                  <p className="text-gray-200">{t.team.alreadyInTeamColon}</p>
                  <div className="rounded-md border border-white/10 p-3">
                    <div className="text-white font-semibold">{team.name}</div>
                    <div className="text-sm text-gray-300">{t.team.membersColon(team.memberCount)}</div>
                  </div>
                  <div className="pt-2">
                    <Button onClick={() => router.push("/team")} className="w-full">{t.team.enterTeam}</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleJoin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinCode">{t.team.inviteCodeShort}</Label>
                    <Input
                      id="joinCode"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder={t.team.joinCodePlaceholder}
                    />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? t.team.joining : t.team.joinButton}
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


