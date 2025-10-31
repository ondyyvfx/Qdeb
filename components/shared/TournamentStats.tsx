"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Trophy, 
  Activity,
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  createTabbycatApi, 
  type TabbycatTournament,
  type TabbycatTeam,
  type TabbycatRound
} from '@/lib/tabbycat';

interface TournamentStatsProps {
  tournamentSlug: string;
  className?: string;
}

interface TournamentStats {
  tournament: TabbycatTournament | null;
  teams: TabbycatTeam[];
  rounds: TabbycatRound[];
  totalSpeakers: number;
  averageTeamSize: number;
  completionRate: number;
  loading: boolean;
  error: string | null;
  available: boolean;
}

const TournamentStats: React.FC<TournamentStatsProps> = ({
  tournamentSlug,
  className = ""
}) => {
  const [stats, setStats] = useState<TournamentStats>({
    tournament: null,
    teams: [],
    rounds: [],
    totalSpeakers: 0,
    averageTeamSize: 0,
    completionRate: 0,
    loading: true,
    error: null,
    available: false
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));
        
        const api = createTabbycatApi();
        
        // Проверяем доступность Tabbycat
        const isAvailable = await api.isAvailable();
        if (!isAvailable) {
          setStats(prev => ({ 
            ...prev, 
            loading: false, 
            available: false,
            error: 'Tabbycat недоступен'
          }));
          return;
        }

        setStats(prev => ({ ...prev, available: true }));

        // Загружаем данные параллельно
        const [tournament, teams, rounds] = await Promise.all([
          api.getTournament(tournamentSlug),
          api.getTeams(tournamentSlug),
          api.getRounds(tournamentSlug)
        ]);

        // Вычисляем статистику
        const totalSpeakers = teams.reduce((sum, team) => sum + (team.speakers?.length || 0), 0);
        const averageTeamSize = teams.length > 0 ? totalSpeakers / teams.length : 0;
        
        // Вычисляем процент завершенности (примерная оценка)
        const completedRounds = rounds.filter(round => 
          round.draw_status === 'confirmed' || round.draw_status === 'released'
        ).length;
        const completionRate = rounds.length > 0 ? (completedRounds / rounds.length) * 100 : 0;

        setStats({
          tournament,
          teams,
          rounds,
          totalSpeakers,
          averageTeamSize,
          completionRate,
          loading: false,
          error: null,
          available: true
        });

      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Ошибка загрузки',
          available: false
        }));
      }
    };

    if (tournamentSlug) {
      fetchStats();
    }
  }, [tournamentSlug]);

  if (stats.loading) {
    return (
      <Card className={`bg-white/5 border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <span className="text-white/80">Загрузка статистики...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats.available || stats.error) {
    return (
      <Card className={`bg-white/5 border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
            <span className="text-white/80">
              {stats.error || 'Статистика недоступна'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats.tournament) {
    return (
      <Card className={`bg-white/5 border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-gray-500">
            <AlertCircle className="h-5 w-5" />
            <span className="text-white/80">
              Турнир не найден в Tabbycat
            </span>
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
            <Activity className="h-5 w-5 text-accent" />
            <CardTitle className="text-white">Статистика турнира</CardTitle>
          </div>
          <Badge 
            variant={stats.tournament.active ? "default" : "secondary"}
            className={stats.tournament.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}
          >
            {stats.tournament.active ? 'Активен' : 'Неактивен'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Основная статистика */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm text-white/80">Команды</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.teams.length}
            </div>
            <div className="text-xs text-white/60">
              {stats.averageTeamSize.toFixed(1)} спикеров в среднем
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm text-white/80">Спикеры</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalSpeakers}
            </div>
            <div className="text-xs text-white/60">
              Всего участников
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="text-sm text-white/80">Раунды</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.rounds.length}
            </div>
            <div className="text-xs text-white/60">
              {stats.completionRate.toFixed(0)}% завершено
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-sm text-white/80">Прогресс</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.completionRate.toFixed(0)}%
            </div>
            <div className="text-xs text-white/60">
              Завершенность
            </div>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Прогресс турнира</span>
            <span className="text-sm text-white/60">
              {stats.completionRate.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Детальная информация */}
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm">Детали</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-2 rounded bg-white/5">
              <span className="text-sm text-white/80">Текущий раунд</span>
              <span className="text-sm text-white font-medium">
                {stats.tournament.current_round || 'Не определен'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-white/5">
              <span className="text-sm text-white/80">Формат</span>
              <span className="text-sm text-white font-medium">
                {stats.tournament.short_name || 'Стандартный'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded bg-white/5">
              <span className="text-sm text-white/80">Статус</span>
              <Badge 
                variant={stats.tournament.active ? "default" : "secondary"}
                className="text-xs"
              >
                {stats.tournament.active ? 'Активен' : 'Неактивен'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Информация о раундах */}
        {stats.rounds.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium text-sm">Раунды</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {stats.rounds.map((round) => (
                <div
                  key={round.id}
                  className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10"
                >
                  <div>
                    <p className="text-sm text-white font-medium">
                      {round.name}
                    </p>
                    <p className="text-xs text-white/60">
                      {round.abbreviation} • {round.draw_type}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      round.draw_status === 'confirmed' ? "default" : 
                      round.draw_status === 'released' ? "default" : 
                      "secondary"
                    }
                    className="text-xs"
                  >
                    {round.draw_status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentStats;

