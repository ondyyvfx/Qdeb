"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Users, 
  Calendar, 
  Trophy, 
  Activity,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  createTabbycatApi, 
  formatTabbycatData, 
  buildTournamentUrl,
  buildTeamsUrl,
  buildRoundsUrl,
  buildResultsUrl,
  buildDrawUrl,
  type TabbycatTournament,
  type TabbycatTeam,
  type TabbycatRound
} from '@/lib/tabbycat';

interface TabbycatTournamentInfoProps {
  tournamentSlug: string;
  className?: string;
}

interface TabbycatData {
  tournament: TabbycatTournament | null;
  teams: TabbycatTeam[];
  rounds: TabbycatRound[];
  loading: boolean;
  error: string | null;
  available: boolean;
}

const TabbycatTournamentInfo: React.FC<TabbycatTournamentInfoProps> = ({
  tournamentSlug,
  className = ""
}) => {
  const [data, setData] = useState<TabbycatData>({
    tournament: null,
    teams: [],
    rounds: [],
    loading: true,
    error: null,
    available: false
  });
  
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'teams' | 'rounds' | 'results'>('teams');

  useEffect(() => {
    const fetchTabbycatData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        const api = createTabbycatApi();
        
        // Проверяем доступность Tabbycat
        const available = await api.isAvailable();
        if (!available) {
          setData(prev => ({ 
            ...prev, 
            loading: false, 
            available: false,
            error: 'Tabbycat недоступен'
          }));
          return;
        }

        // Параллельно загружаем данные
        const [tournament, teams, rounds] = await Promise.all([
          api.getTournament(tournamentSlug),
          api.getTeams(tournamentSlug),
          api.getRounds(tournamentSlug)
        ]);

        setData({
          tournament,
          teams,
          rounds,
          loading: false,
          error: null,
          available: true
        });

      } catch (error) {
        console.error('Ошибка загрузки данных Tabbycat:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Ошибка загрузки',
          available: false
        }));
      }
    };

    if (tournamentSlug) {
      fetchTabbycatData();
    }
  }, [tournamentSlug]);

  const handleOpenTabbycat = (type: 'tournament' | 'teams' | 'rounds' | 'results' | 'draw') => {
    let url: string;
    
    switch (type) {
      case 'tournament':
        url = buildTournamentUrl(tournamentSlug);
        break;
      case 'teams':
        url = buildTeamsUrl(tournamentSlug);
        break;
      case 'rounds':
        url = buildRoundsUrl(tournamentSlug);
        break;
      case 'results':
        url = buildResultsUrl(tournamentSlug);
        break;
      case 'draw':
        url = buildDrawUrl(tournamentSlug);
        break;
      default:
        url = buildTournamentUrl(tournamentSlug);
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (data.loading) {
    return (
      <Card className={`bg-white/5 border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <span className="text-white/80">Загрузка данных из Tabbycat...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.available || data.error) {
    return (
      <Card className={`bg-white/5 border-white/10 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
            <span className="text-white/80">
              {data.error || 'Tabbycat недоступен'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.tournament) {
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

  const { tournament, teams, rounds } = data;

  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-accent" />
            <CardTitle className="text-white">Tabbycat</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={tournament.active ? "default" : "secondary"}
              className={tournament.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}
            >
              {formatTabbycatData.tournamentStatus(tournament)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenTabbycat('tournament')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Открыть
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">
              {formatTabbycatData.teamCount(teams)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">
              {formatTabbycatData.roundCount(rounds)}
            </span>
          </div>
        </div>

        {/* Кнопки быстрого доступа */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenTabbycat('teams')}
            className="border-white/20 text-white hover:bg-white/10 text-xs"
          >
            <Users className="h-3 w-3 mr-1" />
            Команды
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenTabbycat('rounds')}
            className="border-white/20 text-white hover:bg-white/10 text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Раунды
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenTabbycat('results')}
            className="border-white/20 text-white hover:bg-white/10 text-xs"
          >
            <Trophy className="h-3 w-3 mr-1" />
            Результаты
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenTabbycat('draw')}
            className="border-white/20 text-white hover:bg-white/10 text-xs"
          >
            <Activity className="h-3 w-3 mr-1" />
            Draw
          </Button>
        </div>

        {/* Расширенная информация */}
        <div className="border-t border-white/10 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-white/80 hover:text-white hover:bg-white/10 w-full justify-between"
          >
            <span>Подробная информация</span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {expanded && (
            <div className="mt-4 space-y-4">
              {/* Табы */}
              <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
                {(['teams', 'rounds', 'results'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      activeTab === tab
                        ? 'bg-accent text-white'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    {tab === 'teams' && 'Команды'}
                    {tab === 'rounds' && 'Раунды'}
                    {tab === 'results' && 'Результаты'}
                  </button>
                ))}
              </div>

              {/* Содержимое табов */}
              <div className="max-h-64 overflow-y-auto">
                {activeTab === 'teams' && (
                  <div className="space-y-2">
                    {teams.length === 0 ? (
                      <p className="text-white/60 text-sm">Команды не найдены</p>
                    ) : (
                      teams.slice(0, 10).map((team) => (
                        <div key={team.id} className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium text-sm">
                                {team.reference}
                              </h4>
                              <p className="text-white/60 text-xs">
                                {formatTabbycatData.teamSpeakers(team)}
                              </p>
                            </div>
                            {team.institution && (
                              <Badge variant="secondary" className="text-xs">
                                {team.institution}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {teams.length > 10 && (
                      <p className="text-white/60 text-xs text-center">
                        И еще {teams.length - 10} команд...
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'rounds' && (
                  <div className="space-y-2">
                    {rounds.length === 0 ? (
                      <p className="text-white/60 text-sm">Раунды не найдены</p>
                    ) : (
                      rounds.map((round) => (
                        <div key={round.id} className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium text-sm">
                                {round.name}
                              </h4>
                              <p className="text-white/60 text-xs">
                                {round.abbreviation} • {round.draw_type}
                              </p>
                            </div>
                            <Badge 
                              variant={round.draw_status === 'confirmed' ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {round.draw_status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'results' && (
                  <div className="text-center py-8">
                    <Trophy className="h-8 w-8 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">
                      Результаты будут доступны после завершения турнира
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenTabbycat('results')}
                      className="mt-2 border-white/20 text-white hover:bg-white/10"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Открыть в Tabbycat
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TabbycatTournamentInfo;

