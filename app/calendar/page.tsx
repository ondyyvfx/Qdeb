import Navbar from "@/components/shared/Navbar";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import ClientCalendar from "./ClientCalendar";

type Event = {
  id: number;
  title: string;
  description: string;
  cost: number;
  city: string;
  event_datetime: string;
};

export default async function CalendarPage() {
  const res = await fetch("http://localhost:8000/api/events/", {
    next: { revalidate: 60 }, // ISR: кеш на 60 сек
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Ошибка загрузки событий:", res.status, text);
    throw new Error("Не удалось загрузить события");
  }

  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Неверный формат данных");
  }

  const events: Event[] = data as Event[];

  const groupedByMonth = events.reduce((acc: any, event) => {
    const month = format(new Date(event.event_datetime), "LLLL yyyy", { locale: ru });
    acc[month] = acc[month] || [];
    acc[month].push(event);
    return acc;
  }, {});

  return (
    <div>
      <Navbar />
      <div className="mx-19 my-15">
        <h1 className="text-3xl font-bold mb-6">Календарь мероприятий</h1>
        <ClientCalendar events={groupedByMonth} />
      </div>
    </div>
  );
}
