"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { toast } from "react-hot-toast";
import { apiGet, apiPost } from "@/lib/api";
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
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import TeamDashboard from "./TeamDashboard";

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

export default function TeamPage() {
    const router = useRouter();
    const [team, setTeam] = useState<TeamInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [joinCode, setJoinCode] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Load team
    const loadTeam = async () => {
        try {
            setLoading(true);
            const res = await apiGet<TeamInfo>("/teams/my");
            if (res.status === 200 && res.data) {
                setTeam(res.data as unknown as TeamInfo);
            } else {
                setTeam(null);
            }
        } catch (e) {
            console.error("Error loading team:", e);
            setTeam(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeam();
    }, []);

    // Handle join team
    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinCode.trim()) {
            toast.error("Введите код приглашения команды");
            return;
        }
        setSubmitting(true);
        try {
            const res = await apiPost<TeamInfo>("/teams/join", {
                joinCode: joinCode.trim(),
            });
            if (res.status === 200 && res.data) {
                toast.success("Вы присоединились к команде");
                await loadTeam();
            } else {
                toast.error(res.error || "Не удалось присоединиться к команде");
            }
        } catch (error) {
            console.error("Error joining team:", error);
            toast.error("Произошла ошибка при присоединении к команде");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
                        <p className="text-lg text-white">Загрузка...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Если пользователь в команде - показываем дашборд
    if (team) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white">
                                    Команда
                                </h1>
                                <p className="text-xl text-gray-300 mt-2">
                                    {team.name}
                                </p>
                            </div>
                        </div>

                        <TeamDashboard
                            team={{
                                id: team.id,
                                name: team.name,
                                code: team.joinCode,
                                size: team.memberCount,
                                leader:
                                    team.leader !== null &&
                                    team.leader !== undefined,
                            }}
                        />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Если пользователь не в команде - показываем форму входа
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-xl mx-auto">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white flex items-center gap-2">
                                <Users className="w-6 h-6" />
                                Присоединиться к команде
                            </CardTitle>
                            <CardDescription>
                                Введите код приглашения для вступления в команду
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleJoin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="joinCode">
                                        Код приглашения
                                    </Label>
                                    <Input
                                        id="joinCode"
                                        value={joinCode}
                                        onChange={(e) =>
                                            setJoinCode(e.target.value)
                                        }
                                        placeholder="Например: ABC12345"
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1"
                                    >
                                        {submitting
                                            ? "Присоединяем..."
                                            : "Присоединиться"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/team/create")}
                                    >
                                        Создать команду
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
