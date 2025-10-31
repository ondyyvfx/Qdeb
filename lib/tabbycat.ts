/**
 * Tabbycat Integration Utilities
 * Утилиты для интеграции с системой управления дебатными турнирами Tabbycat
 */

// Конфигурация Tabbycat
export const TABBYCAT_CONFIG = {
  // URL Tabbycat сервера (можно настроить через переменные окружения)
  BASE_URL: process.env.NEXT_PUBLIC_TABBYCAT_URL || 'http://localhost:8000',
  
  // API версия
  API_VERSION: 'v1',
  
  // Таймауты
  TIMEOUT: 10000,
  
  // Статусы турниров
  TOURNAMENT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  } as const,
  
  // Статусы раундов
  ROUND_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  } as const
} as const;

/**
 * Строит URL для Tabbycat API
 */
export const buildTabbycatUrl = (endpoint: string): string => {
  const baseUrl = TABBYCAT_CONFIG.BASE_URL.endsWith('/') 
    ? TABBYCAT_CONFIG.BASE_URL.slice(0, -1) 
    : TABBYCAT_CONFIG.BASE_URL;
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Строит URL для турнира в Tabbycat
 */
export const buildTournamentUrl = (tournamentSlug: string): string => {
  return buildTabbycatUrl(`/tournaments/${tournamentSlug}/`);
};

/**
 * Строит URL для команд турнира в Tabbycat
 */
export const buildTeamsUrl = (tournamentSlug: string): string => {
  return buildTabbycatUrl(`/tournaments/${tournamentSlug}/teams/`);
};

/**
 * Строит URL для раундов турнира в Tabbycat
 */
export const buildRoundsUrl = (tournamentSlug: string): string => {
  return buildTabbycatUrl(`/tournaments/${tournamentSlug}/rounds/`);
};

/**
 * Строит URL для результатов турнира в Tabbycat
 */
export const buildResultsUrl = (tournamentSlug: string): string => {
  return buildTabbycatUrl(`/tournaments/${tournamentSlug}/results/`);
};

/**
 * Строит URL для draw турнира в Tabbycat
 */
export const buildDrawUrl = (tournamentSlug: string): string => {
  return buildTabbycatUrl(`/tournaments/${tournamentSlug}/draw/`);
};

/**
 * Типы данных для Tabbycat
 */
export interface TabbycatTournament {
  id: number;
  name: string;
  short_name: string;
  slug: string;
  active: boolean;
  seq: number;
  current_round?: number;
  break_categories?: string[];
  created_at: string;
  updated_at: string;
}

export interface TabbycatTeam {
  id: number;
  reference: string;
  short_reference: string;
  code_name: string;
  institution: string;
  speakers: TabbycatSpeaker[];
  break_categories: string[];
  institution_conflicts: string[];
  venue_constraints: any[];
  answers: any[];
  use_institution_prefix: boolean;
  seed?: number;
  emoji: string;
}

export interface TabbycatSpeaker {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone?: string;
  code_name: string;
  gender: string;
  pronoun?: string;
  anonymous: boolean;
  barcode?: string;
  url_key: string;
  categories: string[];
  answers: any[];
}

export interface TabbycatRound {
  id: number;
  name: string;
  abbreviation: string;
  seq: number;
  draw_type: string;
  draw_status: string;
  feedback_weight: number;
  silent: boolean;
  motions: TabbycatMotion[];
  created_at: string;
  updated_at: string;
}

export interface TabbycatMotion {
  id: number;
  text: string;
  reference: string;
  info_slide?: string;
  created_at: string;
  updated_at: string;
}

export interface TabbycatResult {
  id: number;
  team: number;
  speaker: number;
  position: number;
  score: number;
  margin: number;
  votes_given: number;
  votes_possible: number;
  created_at: string;
  updated_at: string;
}

/**
 * Функции для работы с Tabbycat API
 */
export class TabbycatApi {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl?: string, timeout?: number) {
    this.baseUrl = baseUrl || TABBYCAT_CONFIG.BASE_URL;
    this.timeout = timeout || TABBYCAT_CONFIG.TIMEOUT;
  }

  /**
   * Получает информацию о турнире
   */
  async getTournament(slug: string): Promise<TabbycatTournament | null> {
    try {
      const url = buildTournamentUrl(slug);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        console.warn(`Tabbycat: Турнир ${slug} не найден (${response.status})`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`Tabbycat: Ошибка при получении турнира ${slug}:`, error);
      return null;
    }
  }

  /**
   * Получает список команд турнира
   */
  async getTeams(slug: string): Promise<TabbycatTeam[]> {
    try {
      const url = buildTeamsUrl(slug);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        console.warn(`Tabbycat: Команды турнира ${slug} не найдены (${response.status})`);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.results || [];
    } catch (error) {
      console.error(`Tabbycat: Ошибка при получении команд турнира ${slug}:`, error);
      return [];
    }
  }

  /**
   * Получает список раундов турнира
   */
  async getRounds(slug: string): Promise<TabbycatRound[]> {
    try {
      const url = buildRoundsUrl(slug);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        console.warn(`Tabbycat: Раунды турнира ${slug} не найдены (${response.status})`);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.results || [];
    } catch (error) {
      console.error(`Tabbycat: Ошибка при получении раундов турнира ${slug}:`, error);
      return [];
    }
  }

  /**
   * Получает результаты турнира
   */
  async getResults(slug: string): Promise<TabbycatResult[]> {
    try {
      const url = buildResultsUrl(slug);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        console.warn(`Tabbycat: Результаты турнира ${slug} не найдены (${response.status})`);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.results || [];
    } catch (error) {
      console.error(`Tabbycat: Ошибка при получении результатов турнира ${slug}:`, error);
      return [];
    }
  }

  /**
   * Проверяет доступность Tabbycat
   */
  async isAvailable(): Promise<boolean> {
    try {
      const url = buildTabbycatUrl('/tournaments/');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      return response.ok;
    } catch (error) {
      console.warn('Tabbycat недоступен:', error);
      return false;
    }
  }
}

/**
 * Создает экземпляр Tabbycat API
 */
export const createTabbycatApi = (): TabbycatApi => {
  return new TabbycatApi();
};

/**
 * Утилиты для форматирования данных Tabbycat
 */
export const formatTabbycatData = {
  /**
   * Форматирует статус турнира для отображения
   */
  tournamentStatus: (tournament: TabbycatTournament): string => {
    if (!tournament.active) return 'Неактивен';
    if (tournament.current_round) return `Раунд ${tournament.current_round}`;
    return 'Активен';
  },

  /**
   * Форматирует количество команд
   */
  teamCount: (teams: TabbycatTeam[]): string => {
    const count = teams.length;
    if (count === 0) return 'Нет команд';
    if (count === 1) return '1 команда';
    if (count < 5) return `${count} команды`;
    return `${count} команд`;
  },

  /**
   * Форматирует количество раундов
   */
  roundCount: (rounds: TabbycatRound[]): string => {
    const count = rounds.length;
    if (count === 0) return 'Нет раундов';
    if (count === 1) return '1 раунд';
    if (count < 5) return `${count} раунда`;
    return `${count} раундов`;
  },

  /**
   * Форматирует информацию о спикерах команды
   */
  teamSpeakers: (team: TabbycatTeam): string => {
    const speakers = team.speakers || [];
    if (speakers.length === 0) return 'Нет спикеров';
    
    const names = speakers.map(speaker => 
      `${speaker.name} ${speaker.last_name}`.trim()
    ).filter(name => name.length > 0);
    
    if (names.length === 0) return 'Спикеры не указаны';
    if (names.length === 1) return names[0];
    if (names.length === 2) return names.join(' и ');
    
    return `${names.slice(0, -1).join(', ')} и ${names[names.length - 1]}`;
  }
};

/**
 * Хуки для React компонентов
 */
export const useTabbycatTournament = (slug: string) => {
  const [tournament, setTournament] = React.useState<TabbycatTournament | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const api = createTabbycatApi();
        const data = await api.getTournament(slug);
        
        setTournament(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTournament();
    }
  }, [slug]);

  return { tournament, loading, error };
};

export const useTabbycatTeams = (slug: string) => {
  const [teams, setTeams] = React.useState<TabbycatTeam[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const api = createTabbycatApi();
        const data = await api.getTeams(slug);
        
        setTeams(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTeams();
    }
  }, [slug]);

  return { teams, loading, error };
};

// Импорт React для хуков
import React from 'react';

