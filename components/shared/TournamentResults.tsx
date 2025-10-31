"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Trophy,
    Medal,
    Users,
    Award,
    ExternalLink,
    Loader2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import {
    createTabbycatApi,
    buildResultsUrl,
    type TabbycatResult,
    type TabbycatTeam,
} from "@/lib/tabbycat";

interface TournamentResultsProps {
    tournamentSlug: string;
    className?: string;
}

interface TeamResult {
    team: TabbycatTeam;
    totalScore: number;
    wins: number;
    losses: number;
    position: number;
    speakers: {
        speaker: any;
        totalScore: number;
        averageScore: number;
        speeches: number;
    }[];
}

const TournamentResults: React.FC<TournamentResultsProps> = ({
    tournamentSlug,
    className = "",
}) => {
    const [results, setResults] = useState<TabbycatResult[]>([]);
    const [teams, setTeams] = useState<TabbycatTeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [available, setAvailable] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);

                const api = createTabbycatApi();

                // Проверяем доступность Tabbycat
                const isAvailable = await api.isAvailable();
                if (!isAvailable) {
                    setAvailable(false);
                    setError("Tabbycat недоступен");
                    return;
                }

                setAvailable(true);

                // Загружаем результаты и команды параллельно
                const [resultsData, teamsData] = await Promise.all([
                    api.getResults(tournamentSlug),
                    api.getTeams(tournamentSlug),
                ]);

                setResults(resultsData);
                setTeams(teamsData);
            } catch (error) {
                console.error("Ошибка загрузки результатов:", error);
                setError(
                    error instanceof Error ? error.message : "Ошибка загрузки"
                );
            } finally {
                setLoading(false);
            }
        };

        if (tournamentSlug) {
            fetchResults();
        }
    }, [tournamentSlug]);

    // Обрабатываем результаты и группируем по командам
    const processedResults = React.useMemo(() => {
        if (!results.length || !teams.length) return [];

        const teamResults = new Map<number, TeamResult>();

        // Инициализируем результаты команд
        teams.forEach((team) => {
            teamResults.set(team.id, {
                team,
                totalScore: 0,
                wins: 0,
                losses: 0,
                position: 0,
                speakers: team.speakers.map((speaker) => ({
                    speaker,
                    totalScore: 0,
                    averageScore: 0,
                    speeches: 0,
                })),
            });
        });

        // Обрабатываем результаты
        results.forEach((result) => {
            const teamResult = teamResults.get(result.team);
            if (teamResult) {
                teamResult.totalScore += result.score;

                // Обновляем статистику спикера
                const speakerResult = teamResult.speakers.find(
                    (s) => s.speaker.id === result.speaker
                );
                if (speakerResult) {
                    speakerResult.totalScore += result.score;
                    speakerResult.speeches++;
                    speakerResult.averageScore =
                        speakerResult.totalScore / speakerResult.speeches;
                }
            }
        });

        // Сортируем команды по общему счету
        const sortedResults = Array.from(teamResults.values())
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((result, index) => ({
                ...result,
                position: index + 1,
            }));

        return sortedResults;
    }, [results, teams]);

    const handleOpenResults = () => {
        const url = buildResultsUrl(tournamentSlug);
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const getPositionIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />;
            case 3:
                return <Medal className="h-5 w-5 text-amber-600" />;
            default:
                return <Award className="h-4 w-4 text-white/60" />;
        }
    };

    const getPositionColor = (position: number) => {
        switch (position) {
            case 1:
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            case 2:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30";
            case 3:
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            default:
                return "bg-white/5 text-white/80 border-white/10";
        }
    };

    if (loading) {
        return (
            <Card className={`bg-white/5 border-white/10 ${className}`}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-accent" />
                        <span className="text-white/80">
                            Загрузка результатов...
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!available || error) {
        return (
            <Card className={`bg-white/5 border-white/10 ${className}`}>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-2 text-yellow-500">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-white/80">
                            {error || "Результаты недоступны"}
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (processedResults.length === 0) {
        return (
            <Card className={`bg-white/5 border-white/10 ${className}`}>
                <CardContent className="p-6">
                    <div className="text-center py-8">
                        <Trophy className="h-8 w-8 text-white/40 mx-auto mb-2" />
                        <p className="text-white/60 text-sm">
                            Результаты пока недоступны
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenResults}
                            className="mt-2 border-white/20 text-white hover:bg-white/10"
                        >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Проверить в Tabbycat
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`bg-white/5 border-white/10 ${className}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-accent" />
                        <CardTitle className="text-white">
                            Результаты турнира
                        </CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant="outline"
                            className="border-white/20 text-white/80"
                        >
                            {processedResults.length} команд
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenResults}
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Открыть
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Топ-3 команды */}
                <div className="space-y-3">
                    {processedResults.slice(0, 3).map((result) => (
                        <div
                            key={result.team.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${getPositionColor(
                                result.position
                            )}`}
                        >
                            <div className="flex items-center space-x-3">
                                {getPositionIcon(result.position)}
                                <div>
                                    <h4 className="font-semibold text-sm">
                                        {result.team.reference}
                                    </h4>
                                    <p className="text-xs opacity-80">
                                        {result.team.institution ||
                                            "Без институции"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg">
                                    {result.totalScore.toFixed(1)}
                                </div>
                                <div className="text-xs opacity-80">
                                    {result.speakers.length} спикеров
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Расширенная таблица */}
                {processedResults.length > 3 && (
                    <div className="border-t border-white/10 pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpanded(!expanded)}
                            className="text-white/80 hover:text-white hover:bg-white/10 w-full justify-between"
                        >
                            <span>Показать все результаты</span>
                            {expanded ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>

                        {expanded && (
                            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                                {processedResults.slice(3).map((result) => (
                                    <div
                                        key={result.team.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-semibold">
                                                {result.position}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm text-white">
                                                    {result.team.reference}
                                                </h4>
                                                <p className="text-xs text-white/60">
                                                    {result.team.institution ||
                                                        "Без институции"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-sm text-white">
                                                {result.totalScore.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-white/60">
                                                {result.speakers.length}{" "}
                                                спикеров
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Лучшие спикеры */}
                <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white font-medium text-sm mb-3">
                        Лучшие спикеры
                    </h4>
                    <div className="space-y-2">
                        {processedResults
                            .flatMap((result) => result.speakers)
                            .sort((a, b) => b.averageScore - a.averageScore)
                            .slice(0, 5)
                            .map((speakerResult, index) => (
                                <div
                                    key={`${speakerResult.speaker.id}-${index}`}
                                    className="flex items-center justify-between p-2 rounded bg-white/5"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-xs font-semibold text-accent">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium">
                                                {speakerResult.speaker.name}{" "}
                                                {
                                                    speakerResult.speaker
                                                        .last_name
                                                }
                                            </p>
                                            <p className="text-xs text-white/60">
                                                {speakerResult.speeches}{" "}
                                                выступлений
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-sm text-white">
                                            {speakerResult.averageScore.toFixed(
                                                1
                                            )}
                                        </div>
                                        <div className="text-xs text-white/60">
                                            средний
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TournamentResults;
