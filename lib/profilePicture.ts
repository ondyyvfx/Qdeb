/**
 * Утилита для формирования URL изображения профиля
 * 
 * Принимает имя файла или путь из ответа API (например, "933af2d6-5637-41be-95bb-11395841b7b1.jpg")
 * и формирует полный URL для GET запроса на /api/files/profile-picture/{fileName}
 * 
 * @param profilePicture - имя файла или путь из поля profilePicture в ответе API
 * @returns полный URL для получения изображения профиля или null
 */
export function resolveProfilePictureUrl(
  profilePicture?: string | null
): string | null {
  if (!profilePicture) return null;

  // Если уже полный URL - возвращаем как есть
  if (profilePicture.startsWith("http://") || profilePicture.startsWith("https://")) {
    return profilePicture;
  }

  // Получаем базовый URL API из переменной окружения
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";
  
  // Убираем /api из конца, если есть (для получения origin)
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");

  // Извлекаем только имя файла из пути (если был путь типа "uploads/uuid.jpg")
  let fileName = profilePicture;
  if (profilePicture.includes("/")) {
    fileName = profilePicture.split("/").pop() || profilePicture;
  }

  // Формируем правильный URL: {apiOrigin}/api/files/profile-picture/{fileName}
  // Например: https://api.qdeb.kz/api/files/profile-picture/933af2d6-5637-41be-95bb-11395841b7b1.jpg
  return `${apiOrigin}/api/files/profile-picture/${fileName}`;
}

