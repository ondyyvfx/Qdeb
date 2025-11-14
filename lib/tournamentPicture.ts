/**
 * Утилита для формирования URL изображения турнира
 * 
 * Принимает имя файла или путь из ответа API (например, "30e1f290-e639-468c-aa6f-15f14133f391.png")
 * и формирует полный URL для GET запроса на /api/files/profile-picture/{fileName}
 * Использует тот же endpoint, что и для аватаров профиля
 * 
 * @param tournamentPicture - имя файла или путь из поля tournamentPicture/photoUrl в ответе API
 * @returns полный URL для получения изображения турнира или null
 */
export function resolveTournamentPictureUrl(
  tournamentPicture?: string | null
): string | null {
  if (!tournamentPicture) return null;

  // Если уже полный URL - возвращаем как есть
  if (tournamentPicture.startsWith("http://") || tournamentPicture.startsWith("https://")) {
    return tournamentPicture;
  }

  // Получаем базовый URL API из переменной окружения
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";
  
  // Убираем /api из конца, если есть (для получения origin)
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");

  // Извлекаем только имя файла из пути (если был путь типа "uploads/uuid.jpg")
  let fileName = tournamentPicture;
  if (tournamentPicture.includes("/")) {
    fileName = tournamentPicture.split("/").pop() || tournamentPicture;
  }

  // Формируем правильный URL: {apiOrigin}/api/files/profile-picture/{fileName}
  // Используем тот же путь, что и для аватаров, так как бэкенд возвращает просто UUID с расширением
  // Например: https://api.qdeb.kz/api/files/profile-picture/30e1f290-e639-468c-aa6f-15f14133f391.png
  return `${apiOrigin}/api/files/profile-picture/${fileName}`;
}

