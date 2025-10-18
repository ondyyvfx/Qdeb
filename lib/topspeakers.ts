export async function getTopSpeakers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

  try {
    // Первичная попытка: (исходная задумка) speakers endpoint
    const primary = await fetch(`${baseUrl}/speakers`, { cache: "no-store" });
    if (primary.ok && (primary.headers.get("content-type") || "").includes("application/json")) {
      const data: unknown = await primary.json();
      const array = Array.isArray((data as any)?.results) ? (data as any).results as unknown[] : Array.isArray(data) ? (data as unknown[]) : [];
      return array.map((s: any) => ({
        id: s?.id,
        name: s?.full_name ?? s?.username ?? "",
        image: s?.avatar ?? s?.profilePictureUrl ?? null,
        avg_speech: s?.avg_speech,
        elo: s?.elo_rating,
        num_tournaments: s?.tournaments_completed,
      }));
    }
  } catch {
    // ignore and fallback below
  }

  try {
    // Фолбэк: публичный список пользователей, если speakers нет
    const fallback = await fetch(`${baseUrl}/users`, { cache: "no-store" });
    if (!fallback.ok || !((fallback.headers.get("content-type") || "").includes("application/json"))) {
      return [];
    }
    const data: unknown = await fallback.json();
    const arr = Array.isArray(data) ? data : [];
    return arr.map((u: any) => ({
      id: u?.id,
      name: u?.fullName ?? u?.username ?? "",
      image: u?.profilePictureUrl ?? null,
      avg_speech: u?.avg_speech,
      elo: u?.elo_rating,
      num_tournaments: u?.tournaments_completed,
    }));
  } catch {
    return [];
  }
}
