export async function getTopSpeakers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/speakers/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Ошибка при загрузке спикеров");
  const data = await res.json()
  return data.results.map((s: any) => ({
    id: s.id,
    name: s.full_name,
    image: s.avatar,
    avg_speech: s.avg_speech,
    elo: s.elo_rating,
    num_tournaments: s.tournaments_completed,
  }));
}
