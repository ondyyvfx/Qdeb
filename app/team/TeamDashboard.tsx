"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import TeamMembers from "./TeamMembers";
import TeamApplications from "./TeamApplications";
import TeamStats from "./TeamStats";

type TeamInfo = {
    id: number;
    name: string;
    code: string;
    size: number;
    leader: boolean;
};

type TeamDashboardProps = {
    team: TeamInfo;
};

type DashboardTab =
    | "overview"
    | "members"
    | "applications"
    | "create-form"
    | "settings";

export default function TeamDashboard({ team }: TeamDashboardProps) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

    const tabs: { id: DashboardTab; label: string }[] = [
        { id: "overview", label: t.team.tabOverview },
        { id: "members", label: t.team.tabMembers },
        { id: "applications", label: t.team.tabApplications },
        { id: "settings", label: t.team.tabSettings },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                activeTab === tab.id
                                    ? "bg-accent text-white shadow-lg"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === "overview" && <TeamStats team={team} />}
                {activeTab === "members" && <TeamMembers team={team} />}
                {activeTab === "applications" && (
                    <TeamApplications team={team} />
                )}
                {activeTab === "settings" && (
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <span className="text-xl">⚙️</span>
                                {t.team.settingsTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <p className="text-yellow-400 text-sm">
                                        {t.team.settingsDev}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <h3 className="text-white font-medium mb-2">
                                            {t.team.inviteCode}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-black/20 px-3 py-1 rounded text-white font-mono">
                                                {team.code}
                                            </code>
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    navigator.clipboard.writeText(
                                                        team.code
                                                    )
                                                }
                                                className="bg-accent hover:bg-accent/90"
                                            >
                                                {t.team.copy}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <h3 className="text-white font-medium mb-2">
                                            {t.team.status}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-white">
                                                {t.team.active}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
