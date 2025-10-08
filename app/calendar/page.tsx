import Navbar from "@/components/shared/Navbar";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import ClientCalendar from "./ClientCalendar";
import Footer from "@/components/shared/Footer";

type Event = {
  id: number;
  title: string;
  description: string;
  cost: string;
  city: string;
  start_date: string;
  end_date: string;
  is_registration_open: boolean;
  registration_link: string | null;
  categories: string[];
};

export default async function CalendarPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api";
  const res = await fetch(`${baseUrl}/tournaments/getAll`, {
    next: { revalidate: 60 }, // ISR: кеш на 60 сек
  });
 
  if (!res.ok) {
    const text = await res.text();
    console.error("Ошибка загрузки событий:", res.status, text);
    throw new Error("Не удалось загрузить события");
  }

  const data: unknown = await res.json();
  const arr = Array.isArray(data) ? data : [];
  const events: Event[] = arr.map((t: any) => ({
    id: t.id,
    title: t.name,
    description: t.description || "",
    cost: String(t.fee ?? "0"),
    city: t.organizerName || "",
    start_date: t.eventDate,
    end_date: t.eventDate,
    is_registration_open: Boolean(t.active),
    registration_link: t.tabbycatUrl || null,
    categories: [],
  }));

  // Группировка событий по месяцам
  const groupedByMonth = events.reduce((acc: any, event) => {
    const month = format(new Date(event.start_date), "LLLL yyyy", {
      locale: ru,
    });
    acc[month] = acc[month] || [];
    acc[month].push(event);
    return acc;
  }, {});

  // Теперь передаем категории из базы данных через пропс
  const categories = ["Для студентов", "Для профессионалов", "Онлайн"]; // Пример статичного списка категорий, если нужно сделать динамичным, используйте API для получения.

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-white/10 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Календарь турниров
            </h1>
            <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto">
              Просматривайте турниры по месяцам и планируйте свое участие
            </p>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <ClientCalendar events={groupedByMonth} categories={categories} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
