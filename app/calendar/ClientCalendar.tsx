"use client";

import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { useMemo } from "react";

type Event = {
  id: number;
  title: string;
  description: string;
  cost: string; // Стоимость как строка
  city: string;
  start_date: string;
  end_date: string | null;
  is_registration_open: boolean;
  registration_link: string | null;
  categories: string[]; // Категории могут быть динамическими
  formattedDate?: string;
  formattedDay?: string;
  formattedMonth?: string;
};

type ClientCalendarProps = {
  events: Record<string, Event[]>;
  categories: string[]; // Принимаем категории как пропс
};

const ClientCalendar = ({ events, categories }: ClientCalendarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [formattedEvents, setFormattedEvents] = useState<
    Record<string, Event[]>
  >({});
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  useEffect(() => {
    const formatEvents = () => {
      const monthMap: Record<
        string,
        { displayMonth: string; events: Event[] }
      > = {};

      Object.values(events)
        .flat()
        .forEach((event) => {
          const rawStartDate = event.start_date.split("T")[0];
          const rawEndDate = event.end_date?.split("T")[0] ?? rawStartDate; // Если нет даты окончания, используем дату начала
          const startDate = parseISO(rawStartDate);
          const endDate = parseISO(rawEndDate);

          const monthKey = format(startDate, "yyyy-MM");
          const displayMonth = format(startDate, "LLLL yyyy", { locale: ru });

          const formattedEvent: Event = {
            ...event,
            formattedDate: `${format(startDate, "dd.MM.yyyy")} - ${format(
              endDate,
              "dd.MM.yyyy"
            )}`, // Форматируем дату с учётом окончания
            formattedMonth: displayMonth,
          };

          if (!monthMap[monthKey]) {
            monthMap[monthKey] = { displayMonth, events: [] };
          }

          monthMap[monthKey].events.push(formattedEvent);
        });

      const sortedKeys = Object.keys(monthMap).sort();

      const sortedMap: Record<string, Event[]> = {};
      sortedKeys.forEach((key) => {
        const { displayMonth, events } = monthMap[key];
        sortedMap[displayMonth] = events;
      });

      setFormattedEvents(sortedMap);
    };

    formatEvents();
  }, [events]);

  const filteredEvents = Object.entries(formattedEvents).map(
    ([month, eventsList]) => {
      const sortedEvents = [...eventsList].sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );

      const filtered = sortedEvents.filter((event) => {
        const matchesSearchTerm = event.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity
          ? event.city.toLowerCase().includes(selectedCity.toLowerCase())
          : true;
        return matchesSearchTerm && matchesCity;
      });

      return { month, events: filtered };
    }
  );

  const uniqueCities = useMemo(() => {
    const allEvents = Object.values(formattedEvents).flat();
    const cities = new Set(allEvents.map((event) => event.city));
    return ["Все", ...Array.from(cities)];
  }, [formattedEvents]);

  const categoryTranslations: Record<string, string> = {
    students: "Для студентов",
    offline: "Оффлайн",
    bpf: "БПФ",
    school: "Для школьников",
    online: "Онлайн",
    apf: "АПФ",
    wsdc: "WSDC",
    // Добавьте другие категории по мере необходимости
  };

  return (
    <div>
      {/* Фильтры */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Поиск по названию"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-lg bg-dark-800 text-white w-1/3"
        />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="p-2 rounded-lg bg-primary text-white w-1/3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ color: "#fff" }}
        >
          {uniqueCities.map((city) => (
            <option
              key={city}
              value={city === "Все" ? "" : city}
              style={{ color: "#fff" }}
            >
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Список мероприятий */}
      {filteredEvents.map(
        ({ month, events }) =>
          events.length > 0 && (
            <div key={month} className="mb-9">
              <h2 className="text-2xl font-semibold mb-4 capitalize">
                {month}
              </h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="relative bg-primary p-6 py-4 rounded-2xl shadow-lg flex gap-6"
                  >
                    {event.is_registration_open && (
                      <div className="border-[0.5px] mx-4 px-4 py-2 rounded-sm absolute top-9 right-4 text-sm font-medium text-green-400 z-10">
                        Регистрация открыта
                      </div>
                    )}
                    {!event.is_registration_open && (
                      <div className="border-[0.5px] mx-4 px-4 py-2 rounded-sm absolute top-9 right-4 text-sm font-medium text-red-400 z-10">
                        Регистрация закрыта
                      </div>
                    )}
                    {event.is_registration_open === null && (
                      <div className="border-[0.5px] mx-4 px-4 py-2 rounded-sm absolute top-9 right-4 text-sm font-medium text-yellow-400 z-10">
                        Неизвестно
                      </div>
                    )}
                    <div className="z-0 relative w-50 h-50 flex-shrink-0 m-0 p-0 -ml-6 -mr-8">
                      <img
                        src="/assets/Qback.svg"
                        alt="logo"
                        className="absolute z-0 top-0 left-0 w-full h-full rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-6xl">
                        <div className="flex flex-col items-center">
                          <span>
                            {format(parseISO(event.start_date), "dd")}
                          </span>
                          {event.end_date &&
                            event.end_date !== event.start_date && (
                              <span>
                                {format(parseISO(event.end_date), "dd")}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 text-white mt-4 z-10">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold">{event.title}</div>
                        <div className="text-xs text-gray-400">
                          {format(
                            parseISO(event.start_date.split("T")[0]),
                            "d MMMM, EEEE",
                            { locale: ru }
                          )}
                          {event.end_date && event.end_date !== event.start_date
                            ? ` - ${format(
                                parseISO(event.end_date),
                                "d MMMM, EEEE",
                                { locale: ru }
                              )}`
                            : null}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs font-medium">
                        {event.categories.map((category) => (
                          <span
                            key={category}
                            className="bg-[#6F462A] px-4 py-1 rounded-sm text-sm font-m"
                          >
                            {categoryTranslations[category] || category}{" "}
                            {/* Отображаем переведённую категорию */}
                          </span>
                        ))}
                      </div>

                      <div className="text-sm text-green-400 z-10">
                        {event.cost === "0" ? "Бесплатно" : `${event.cost}`}
                      </div>
                      <div className="text-sm text-gray-300 max-w-[450px]">
                        {" "}
                        г. {event.city}
                      </div>

                      {/* Описание с кнопкой Подробнее */}
                      <div className="text-sm text-gray-400 max-w-[900px]">
                        {activeEvent === event.id ? event.description : ""}
                      </div>

                      <div className="absolute right-4 bottom-6 flex gap-2">
                        {event.is_registration_open &&
                          event.registration_link && (
                            <a
                              href={event.registration_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-400 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-500 transition"
                            >
                              Зарегистрироваться
                            </a>
                          )}
                        <button
                          className="bg-white text-black px-6 py-2 rounded-md font-semibold"
                          onClick={() =>
                            setActiveEvent(
                              activeEvent === event.id ? null : event.id
                            )
                          }
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default ClientCalendar;
