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
  let events: Event[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tournaments/getAll`,
      {
        next: { revalidate: 60 }, // ISR: кеш на 60 сек
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Ошибка загрузки событий:", res.status, text);

      // Если 403 или другие ошибки - используем пустой массив
      if (res.status === 403 || res.status >= 400) {
        console.warn("API недоступен, используем пустые данные");
        events = [];
      } else {
        throw new Error("Не удалось загрузить события");
      }
    } else {
      const data: unknown = await res.json();

      if (
        typeof data !== "object" ||
        data === null ||
        !("results" in data) ||
        !Array.isArray((data as any).results)
      ) {
        console.warn("Неверный формат данных, используем пустые данные");
        events = [];
      } else {
        events = (data as any).results;
      }
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных календаря:", error);
    // В случае любой ошибки используем пустой массив
    events = [];
  }

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
    <div>
      <Navbar />
      <div className="mx-3 md:mx-10 xl:mx-19 my-15">
        <h1 className="text-3xl font-bold mb-6">Календарь мероприятий</h1>
        <ClientCalendar events={groupedByMonth} categories={categories} />
      </div>
      <Footer />
    </div>
  );
}
