"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

type TeamInfo = {
  id: number;
  name: string;
  code: string;
  size: number;
  leader: boolean;
};

type TeamStatsProps = {
  team: TeamInfo;
};

const TEAM_CAPACITY = 2;

export default function TeamStats({ team }: TeamStatsProps) {
  const { t } = useLanguage();
  const memberCount = useMemo(
    () => Math.max(team.size, 1),
    [team.size]
  );

  const readiness = useMemo(
    () => Math.min(100, Math.round((memberCount / TEAM_CAPACITY) * 100)),
    [memberCount]
  );

  const freeSlots = useMemo(
    () => Math.max(0, TEAM_CAPACITY - memberCount),
    [memberCount]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <p className="text-blue-200 text-sm font-medium mb-1">
              {t.team.membersLabel}
            </p>
            <p className="text-3xl font-bold text-white">
              {memberCount}/{TEAM_CAPACITY}
            </p>
            <p className="text-xs text-blue-100/70 mt-2">
              {t.team.fullRosterNote(TEAM_CAPACITY)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <p className="text-purple-200 text-sm font-medium mb-1">
              {t.team.freeSlots}
            </p>
            <p className="text-3xl font-bold text-white">{freeSlots}</p>
            <p className="text-xs text-purple-100/70 mt-2">
              {t.team.inviteToFillSlot}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/30">
          <CardContent className="p-6">
            <p className="text-green-200 text-sm font-medium mb-1">
              {t.team.readiness}
            </p>
            <p className="text-3xl font-bold text-white">{readiness}%</p>
            <p className="text-xs text-green-100/70 mt-2">
              {team.size === TEAM_CAPACITY
                ? t.team.rosterComplete
                : t.team.addToIncrease}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-500/30">
          <CardContent className="p-6 space-y-3">
            <div>
              <p className="text-orange-200 text-sm font-medium mb-1">
                {t.team.inviteCodeShort}
              </p>
              <code className="inline-flex items-center rounded-md bg-black/30 px-3 py-1 text-sm text-white">
                {team.code}
              </code>
            </div>
            <Button
              size="sm"
              className="bg-orange-500/80 hover:bg-orange-500 text-white"
              onClick={() => navigator.clipboard.writeText(team.code)}
            >
              {t.team.copy}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            {t.team.status}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{t.team.readinessForTournaments}</span>
              <span className="text-white font-medium">{readiness}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-800">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-accent to-orange-500 transition-all duration-500"
                style={{ width: `${readiness}%` }}
              ></div>
            </div>
          </div>

          {team.leader ? (
            <p className="text-sm text-gray-300">{t.team.leaderNote}</p>
          ) : (
            <p className="text-sm text-gray-300">{t.team.memberNote}</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-xl">📈</span>
            {t.team.statsLater}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300 space-y-2">
          <p>{t.team.statsLaterText1}</p>
          <p>{t.team.statsLaterText2}</p>
        </CardContent>
      </Card>
    </div>
  );
}
