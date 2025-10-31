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
import { Input } from "@/components/ui/input";
import {
    CheckCircle2,
    XCircle,
    Users,
    Calendar,
    ArrowLeft,
    Search,
    Filter,
    Download,
    RefreshCw,
    Mail,
    Phone,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { useParams, useRouter } from "next/navigation";

// ... остальные интерфейсы остаются без изменений ...

export default function ApplicationsPage() {
    const params = useParams();
    const router = useRouter();
    const [applications, setApplications] = useState<
        TournamentApplicationListItem[] | null
    >(null);
    const [tournament, setTournament] = useState<TournamentInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const tournamentSlug = params.slug as string;

    // ... остальные функции остаются без изменений ...

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Хедер */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex items-center gap-2 mb-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Назад
                            </Button>
                            <h1 className="text-4xl md:text-5xl font-bold text-white">
                                Заявки на турнир
                            </h1>
                            {tournament && (
                                <p className="text-xl text-gray-300 mt-2">
                                    {tournament.name}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                onClick={loadApplications}
                                disabled={loading}
                            >
                                <RefreshCw
                                    className={`w-4 h-4 mr-2 ${
                                        loading ? "animate-spin" : ""
                                    }`}
                                />
                                Обновить
                            </Button>
                            <Button
                                variant="outline"
                                onClick={exportApplications}
                                disabled={
                                    !applications || applications.length === 0
                                }
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Экспорт
                            </Button>
                        </div>
                    </div>

                    {/* ... остальной код без изменений ... */}

                    {/* Фильтры и поиск - ИСПРАВЛЕННАЯ ЧАСТЬ */}
                    {applications && applications.length > 0 && (
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Поиск по команде, капитану или пользователю..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10 bg-white/5 border-white/10"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-gray-400" />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value)
                                            }
                                            className="w-full sm:w-48 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            <option value="ALL">
                                                Все статусы
                                            </option>
                                            <option value="PENDING">
                                                На рассмотрении
                                            </option>
                                            <option value="APPROVED">
                                                Принятые
                                            </option>
                                            <option value="REJECTED">
                                                Отклоненные
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ... остальной код без изменений ... */}
                </div>
            </main>

            <Footer />
        </div>
    );
}

// ... остальные функции без изменений ...
