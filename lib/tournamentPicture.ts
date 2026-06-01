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

  // Если уже относительный путь /api/... - возвращаем как есть (пойдёт через Vercel proxy)
  if (tournamentPicture.startsWith("/api/")) {
    return tournamentPicture;
  }

  // Извлекаем только имя файла
  const fileName = tournamentPicture.includes("/")
    ? tournamentPicture.split("/").pop() || tournamentPicture
    : tournamentPicture;

  return `/api/files/${fileName}`;
}

