# Интеграция с Tabbycat

## Обзор

QDeb интегрирован с системой управления дебатными турнирами Tabbycat для предоставления расширенной функциональности управления турнирами, командами и результатами.

## Возможности интеграции

### 1. Отображение информации о турнире
- Статус турнира (активен/неактивен)
- Количество команд и участников
- Информация о раундах
- Прямые ссылки на Tabbycat

### 2. Результаты турниров
- Топ-3 команды с медалями
- Полная таблица результатов
- Статистика спикеров
- Средние баллы и количество выступлений

### 3. Статистика турнира
- Общее количество команд и спикеров
- Прогресс завершения турнира
- Информация о раундах
- Детальная статистика

### 4. Быстрый доступ
- Кнопки для перехода в Tabbycat
- Прямые ссылки на команды, раунды, результаты
- Интеграция в карточки турниров

## Компоненты

### TabbycatTournamentInfo
Основной компонент для отображения информации о турнире из Tabbycat.

**Использование:**
```tsx
import TabbycatTournamentInfo from '@/components/shared/TabbycatTournamentInfo';

<TabbycatTournamentInfo 
  tournamentSlug="tournament-slug"
  className="mb-6"
/>
```

**Функции:**
- Загрузка данных турнира, команд и раундов
- Отображение статуса и статистики
- Быстрые ссылки на различные разделы Tabbycat
- Расширенная информация с табами

### TournamentResults
Компонент для отображения результатов турнира.

**Использование:**
```tsx
import TournamentResults from '@/components/shared/TournamentResults';

<TournamentResults 
  tournamentSlug="tournament-slug"
  className="mb-6"
/>
```

**Функции:**
- Топ-3 команды с медалями
- Полная таблица результатов
- Статистика лучших спикеров
- Ссылка на полные результаты в Tabbycat

### TournamentStats
Компонент для отображения статистики турнира.

**Использование:**
```tsx
import TournamentStats from '@/components/shared/TournamentStats';

<TournamentStats 
  tournamentSlug="tournament-slug"
  className="mb-6"
/>
```

**Функции:**
- Основная статистика (команды, спикеры, раунды)
- Прогресс-бар завершения турнира
- Детальная информация о раундах
- Статус турнира

## API утилиты

### TabbycatApi
Основной класс для работы с Tabbycat API.

```typescript
import { createTabbycatApi } from '@/lib/tabbycat';

const api = createTabbycatApi();

// Получить информацию о турнире
const tournament = await api.getTournament('tournament-slug');

// Получить команды турнира
const teams = await api.getTeams('tournament-slug');

// Получить раунды турнира
const rounds = await api.getRounds('tournament-slug');

// Получить результаты турнира
const results = await api.getResults('tournament-slug');
```

### Утилиты форматирования
```typescript
import { formatTabbycatData } from '@/lib/tabbycat';

// Форматирование статуса турнира
const status = formatTabbycatData.tournamentStatus(tournament);

// Форматирование количества команд
const teamCount = formatTabbycatData.teamCount(teams);

// Форматирование информации о спикерах
const speakers = formatTabbycatData.teamSpeakers(team);
```

## Конфигурация

### Переменные окружения
```env
# URL Tabbycat сервера
NEXT_PUBLIC_TABBYCAT_URL=http://localhost:8000
```

### Настройка в коде
```typescript
// В lib/tabbycat.ts
export const TABBYCAT_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_TABBYCAT_URL || 'http://localhost:8000',
  API_VERSION: 'v1',
  TIMEOUT: 10000,
  // ... другие настройки
};
```

## Обработка ошибок

Все компоненты включают обработку ошибок:

1. **Недоступность Tabbycat** - отображается предупреждение
2. **Ошибки сети** - показывается сообщение об ошибке
3. **Отсутствие данных** - отображается соответствующее сообщение
4. **Таймауты** - автоматическая обработка с retry логикой

## Производительность

### Оптимизации
- Параллельная загрузка данных
- Кэширование результатов
- Ленивая загрузка расширенной информации
- Ограничение количества отображаемых элементов

### Таймауты
- Основные запросы: 10 секунд
- Проверка доступности: 5 секунд
- Retry логика с экспоненциальной задержкой

## Безопасность

- Все запросы выполняются на клиенте
- Нет передачи чувствительных данных
- Использование CORS для безопасности
- Валидация данных на клиенте

## Расширение функциональности

### Добавление новых компонентов
1. Создайте новый компонент в `components/shared/`
2. Используйте `TabbycatApi` для получения данных
3. Добавьте обработку ошибок и состояний загрузки
4. Интегрируйте в существующие страницы

### Добавление новых API методов
1. Расширьте класс `TabbycatApi` в `lib/tabbycat.ts`
2. Добавьте соответствующие типы данных
3. Обновите утилиты форматирования при необходимости

## Примеры использования

### На странице турнира
```tsx
// app/tournaments/[slug]/page.tsx
import TabbycatTournamentInfo from '@/components/shared/TabbycatTournamentInfo';
import TournamentResults from '@/components/shared/TournamentResults';
import TournamentStats from '@/components/shared/TournamentStats';

export default function TournamentPage({ params }) {
  const { slug } = params;
  
  return (
    <div>
      {/* Основная информация о турнире */}
      <TabbycatTournamentInfo tournamentSlug={slug} />
      
      {/* Результаты турнира */}
      <TournamentResults tournamentSlug={slug} />
      
      {/* Статистика турнира */}
      <TournamentStats tournamentSlug={slug} />
    </div>
  );
}
```

### В карточке турнира
```tsx
// components/shared/TournamentCard.tsx
import { buildTournamentUrl } from '@/lib/tabbycat';

const TournamentCard = ({ slug, title }) => {
  const tabbycatUrl = buildTournamentUrl(slug);
  
  const handleTabbycatClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(tabbycatUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <h3>{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTabbycatClick}
          title="Открыть в Tabbycat"
        >
          <Trophy className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
```

## Устранение неполадок

### Tabbycat недоступен
- Проверьте, что Tabbycat запущен на правильном порту
- Убедитесь, что URL в переменных окружения корректный
- Проверьте CORS настройки Tabbycat

### Ошибки загрузки данных
- Проверьте логи в консоли браузера
- Убедитесь, что slug турнира корректный
- Проверьте, что турнир существует в Tabbycat

### Проблемы с производительностью
- Увеличьте таймауты в конфигурации
- Проверьте размер данных, возвращаемых Tabbycat
- Рассмотрите возможность кэширования

## Заключение

Интеграция с Tabbycat значительно расширяет функциональность QDeb, предоставляя пользователям доступ к детальной информации о турнирах, результатам и статистике. Все компоненты спроектированы с учетом производительности, безопасности и удобства использования.




