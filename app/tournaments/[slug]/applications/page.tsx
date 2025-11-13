"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { toast } from "react-hot-toast";
import { apiGet } from "@/lib/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    XCircle,
    Users,
    Calendar,
    ArrowLeft,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { useParams, useRouter } from "next/navigation";

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

interface TournamentApplicationListItem {
    id: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    team: TeamInfo;
    submittedBy: TeamUser;
    fields: { id: number; name: string; value: string }[];
}

// Правильная реализация apiPost
async function apiPost(url: string, data?: any) {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    };

    if (data !== undefined) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${url}`, options);

    let result;
    try {
        const text = await response.text();
        result = text ? JSON.parse(text) : null;
    } catch {
        result = null;
    }

    return {
        status: response.status,
        data: result,
        error:
            result?.message ||
            (response.status >= 400 ? "Произошла ошибка" : undefined),
    };
}

export default function ApplicationsPage() {
    const params = useParams();
    const router = useRouter();
    const [applications, setApplications] = useState<
        TournamentApplicationListItem[] | null
    >(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<number | null>(null);

    const tournamentSlug = params.slug as string;

    useEffect(() => {
        if (!tournamentSlug) {
            setError("Slug турнира не найден");
            return;
        }

        const loadApplications = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiGet<TournamentApplicationListItem[]>(
                    `/tournaments/${tournamentSlug}/applications`
                );
                if (res.status === 200 && res.data) {
                    setApplications(res.data);
                } else {
                    const msg = res.error || "Не удалось загрузить заявки";
                    setError(msg);
                    toast.error(msg);
                }
            } catch (e) {
                console.error("Error loading applications:", e);
                setError("Произошла ошибка при загрузке заявок");
                toast.error("Произошла ошибка при загрузке заявок");
            } finally {
                setLoading(false);
            }
        };

        loadApplications();
    }, [tournamentSlug]);

    const changeApplicationStatus = async (
        applicationId: number,
        action: "accept" | "reject"
    ) => {
        setUpdating(applicationId);
        try {
            const res = await apiPost(
                `/applications/${applicationId}/${action}`
            );

            if (res.status === 200) {
                toast.success(
                    action === "accept" ? "Заявка принята" : "Заявка отклонена"
                );
                // Обновляем список заявок
                const updatedRes = await apiGet<
                    TournamentApplicationListItem[]
                >(`/tournaments/${tournamentSlug}/applications`);
                if (updatedRes.status === 200 && updatedRes.data) {
                    setApplications(updatedRes.data);
                }
            } else {
                toast.error(res.error || "Не удалось обновить заявку");
            }
        } catch (error) {
            console.error("Error updating application:", error);
            toast.error("Произошла ошибка при обновлении заявки");
        } finally {
            setUpdating(null);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = parseISO(dateString);
            return format(date, "d MMMM yyyy 'в' HH:mm", { locale: ru });
        } catch {
            return dateString;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: {
                label: "На рассмотрении",
                variant: "outline" as const,
                className: "border-yellow-400 text-yellow-400",
            },
            APPROVED: {
                label: "Принята",
                variant: "default" as const,
                className: "bg-green-500 text-white",
            },
            REJECTED: {
                label: "Отклонена",
                variant: "secondary" as const,
                className: "bg-red-500 text-white",
            },
        };

        const config =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.PENDING;

        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
                        <p className="text-lg text-white">Загрузка заявок...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Назад
                    </Button>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        Заявки на турнир
                    </h1>

                    {error && (
                        <Card className="bg-red-500/10 border-red-500/20 mb-6">
                            <CardContent className="p-4">
                                <p className="text-red-400">{error}</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-6">
                        {applications && applications.length > 0 ? (
                            applications.map((application) => (
                                <Card
                                    key={application.id}
                                    className="bg-white/5 border-white/10"
                                >
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-white flex items-center gap-2">
                                                    <Users className="w-5 h-5" />
                                                    {application.team.name}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Подана:{" "}
                                                    {formatDate(
                                                        application.createdAt
                                                    )}
                                                </CardDescription>
                                            </div>
                                            {getStatusBadge(application.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-400 mb-2">
                                                    Информация о команде
                                                </h4>
                                                <div className="space-y-2 text-sm text-gray-300">
                                                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
                                                        <p className="text-gray-400 text-xs uppercase tracking-wide">
                                                            Капитан
                                                        </p>
                                                        <p className="text-white font-medium">
                                                            {application.team.leader?.fullName ||
                                                                application.team.leader?.username ||
                                                                "Не указан"}
                                                        </p>
                                                        {application.team.leader?.email && (
                                                            <p className="text-gray-400 text-xs">
                                                                {application.team.leader.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
                                                        <p className="text-gray-400 text-xs uppercase tracking-wide">
                                                            Напарник
                                                        </p>
                                                        <p className="text-white font-medium">
                                                            {application.team.member?.fullName ||
                                                                application.team.member?.username ||
                                                                "Не указан"}
                                                        </p>
                                                        {application.team.member?.email && (
                                                            <p className="text-gray-400 text-xs">
                                                                {application.team.member.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
                                                        <p className="text-gray-400 text-xs uppercase tracking-wide">
                                                            Подана пользователем
                                                        </p>
                                                        <p className="text-white font-medium">
                                                            {application.submittedBy.fullName ||
                                                                application.submittedBy.username}
                                                        </p>
                                                        <p className="text-gray-400 text-xs">
                                                            {application.submittedBy.email ?? "Email не указан"}
                                                        </p>
                                                    </div>
                                                    <p className="text-white">
                                                        <span className="text-gray-400">
                                                            Состав:
                                                        </span>{" "}
                                                        {application.team.memberCount}/2
                                                    </p>
                                                </div>
                                            </div>

                                            {application.fields &&
                                                application.fields.length >
                                                    0 && (
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-400 mb-2">
                                                            Дополнительные поля
                                                        </h4>
                                                        <div className="space-y-1 text-sm">
                                                            {application.fields.map(
                                                                (field) => (
                                                                    <p
                                                                        key={
                                                                            field.id
                                                                        }
                                                                        className="text-white"
                                                                    >
                                                                        <span className="text-gray-400">
                                                                            {
                                                                                field.name
                                                                            }
                                                                            :
                                                                        </span>{" "}
                                                                        {
                                                                            field.value
                                                                        }
                                                                    </p>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>

                                        {application.status === "PENDING" && (
                                            <div className="flex gap-2 pt-4 border-t border-white/10">
                                                <Button
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() =>
                                                        changeApplicationStatus(
                                                            application.id,
                                                            "accept"
                                                        )
                                                    }
                                                    disabled={
                                                        updating ===
                                                        application.id
                                                    }
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    {updating === application.id
                                                        ? "Обновление..."
                                                        : "Принять заявку"}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        changeApplicationStatus(
                                                            application.id,
                                                            "reject"
                                                        )
                                                    }
                                                    disabled={
                                                        updating ===
                                                        application.id
                                                    }
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    {updating === application.id
                                                        ? "Обновление..."
                                                        : "Отклонить заявку"}
                                                </Button>
                                            </div>
                                        )}

                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="bg-white/5 border-white/10">
                                <CardContent className="p-6 text-center">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">
                                        {applications
                                            ? "Заявок пока нет"
                                            : "Не удалось загрузить заявки"}
                                    </h3>
                                    <p className="text-gray-400">
                                        {applications
                                            ? "На этот турнир еще не было подано ни одной заявки."
                                            : "Попробуйте обновить страницу или проверьте подключение к интернету."}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
