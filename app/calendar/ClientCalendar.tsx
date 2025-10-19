"use client";

import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { useMemo } from "react";
import Link from "next/link";

type Event = {
    id: number;
    slug: string;
    title: string;
    description: string;
    cost: string; // Стоимость как строка
    city: string;
    start_date: string;
    end_date: string | null;
    is_registration_open: boolean | null;
    registration_link: string | null;
    categories: string[]; // Категории могут быть динамическими
    imageUrl: string;
    formattedDate?: string;
    formattedDay?: string;
    formattedMonth?: string;
};

type ClientCalendarProps = {
    events: Record<string, Event[]>;
    categories: string[]; // Принимаем категории как пропс
};

const renderStatusBadge = (event: Event) => {
    let label = "Статус неизвестен";
    let colorClass = "text-yellow-400";

    if (event.is_registration_open === true) {
        label = "Регистрация открыта";
        colorClass = "text-green-400/80";
    } else if (event.is_registration_open === false) {
        label = "Регистрация закрыта";
        colorClass = "text-white/60";
    }

    return (
        <div
            className={`border border-white/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm text-[11px] sm:text-sm font-medium z-10 self-start md:absolute md:top-6 md:right-6 md:self-auto ${colorClass} mb-3 md:mb-0`}
        >
            {label}
        </div>
    );
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
                    const rawEndDate =
                        event.end_date?.split("T")[0] ?? rawStartDate; // Если нет даты окончания, используем дату начала
                    const startDate = parseISO(rawStartDate);
                    const endDate = parseISO(rawEndDate);

                    const monthKey = format(startDate, "yyyy-MM");
                    const displayMonth = format(startDate, "LLLL yyyy", {
                        locale: ru,
                    });

                    const formattedEvent: Event = {
                        ...event,
                        formattedDate: `${format(
                            startDate,
                            "dd.MM.yyyy"
                        )} - ${format(endDate, "dd.MM.yyyy")}`, // Форматируем дату с учётом окончания
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
                    new Date(a.start_date).getTime() -
                    new Date(b.start_date).getTime()
            );

            const filtered = sortedEvents.filter((event) => {
                const matchesSearchTerm = event.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                const matchesCity = selectedCity
                    ? event.city
                          .toLowerCase()
                          .includes(selectedCity.toLowerCase())
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
            <div className="flex flex-row gap-4 justify-between items-stretch sm:items-center mb-6">
                <div className="relative w-full">
                    <img
                        src="/assets/search.svg"
                        width={20}
                        height={20}
                        className="absolute top-[13px] left-2"
                        alt="Поиск"
                    />
                    <input
                        type="text"
                        placeholder="Поиск по названию"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 pl-8 rounded-lg border bg-dark-800 text-white/50 sm:w-full w-[200px]"
                    />
                </div>
                <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="p-2 rounded-lg bg-primary text-white font-montserrat w-full appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Выберите город"
                >
                    {uniqueCities.map((city) => (
                        <option key={city} value={city === "Все" ? "" : city}>
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
                                        key={event.slug}
                                        className="relative bg-primary/90 border border-white/10 p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center gap-4 sm:gap-6"
                                    >
                                        {renderStatusBadge(event)}
                                        <div className="relative w-full aspect-[4/3] md:w-48 md:aspect-square flex-shrink-0 overflow-hidden rounded-xl bg-white/5">
                                            <img
                                                src={
                                                    event.imageUrl ||
                                                    "/assets/Qback.svg"
                                                }
                                                alt={event.title}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl sm:text-5xl  md:text-6xl bg-black/30">
                                                <div className="flex flex-col items-center">
                                                    <span>
                                                        {format(
                                                            parseISO(
                                                                event.start_date
                                                            ),
                                                            "dd"
                                                        )}
                                                    </span>
                                                    {event.end_date &&
                                                        event.end_date !==
                                                            event.start_date && (
                                                            <span>
                                                                {format(
                                                                    parseISO(
                                                                        event.end_date
                                                                    ),
                                                                    "dd"
                                                                )}
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 text-white md:flex-1 z-10">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                <div className="text-lg sm:text-2xl font-bold">
                                                    <Link
                                                        href={`/tournaments/${event.slug}`}
                                                        className="hover:text-accent transition-colors cursor-pointer"
                                                    >
                                                        {event.title}
                                                    </Link>
                                                    <div className="sm:hidden text-xs text-gray-400 text-center mb-2">
                                                        {format(
                                                            parseISO(
                                                                event.start_date.split(
                                                                    "T"
                                                                )[0]
                                                            ),
                                                            "d MMMM, EEEE",
                                                            { locale: ru }
                                                        )}
                                                        {event.end_date &&
                                                        event.end_date !==
                                                            event.start_date
                                                            ? ` - ${format(
                                                                  parseISO(
                                                                      event.end_date
                                                                  ),
                                                                  "d MMMM, EEEE",
                                                                  { locale: ru }
                                                              )}`
                                                            : null}
                                                    </div>
                                                </div>
                                                {/* date with weekdays */}
                                                <div className="hidden text-xs text-gray-400 md:flex">
                                                    {format(
                                                        parseISO(
                                                            event.start_date.split(
                                                                "T"
                                                            )[0]
                                                        ),
                                                        "d MMMM, EEEE",
                                                        { locale: ru }
                                                    )}
                                                    {event.end_date &&
                                                    event.end_date !==
                                                        event.start_date
                                                        ? ` - ${format(
                                                              parseISO(
                                                                  event.end_date
                                                              ),
                                                              "d MMMM, EEEE",
                                                              { locale: ru }
                                                          )}`
                                                        : null}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 hiddenn">
                                                <div className="flex flex-wrap gap-2 text-xs font-medium">
                                                    {/* bg colors based on category */}
                                                    {event.categories.map(
                                                        (category) => {
                                                            let bgColor =
                                                                "bg-secondary";

                                                            if (
                                                                category ===
                                                                "online"
                                                            ) {
                                                                bgColor =
                                                                    "bg-[#2A6F5E]";
                                                            } else if (
                                                                category ===
                                                                "students"
                                                            ) {
                                                                bgColor =
                                                                    "bg-[#6F462A]";
                                                            }

                                                            return (
                                                                <span
                                                                    key={
                                                                        category
                                                                    }
                                                                    className={`${bgColor} px-4 py-1 rounded-sm text-sm font-m text-white`}
                                                                >
                                                                    {categoryTranslations[
                                                                        category
                                                                    ] ||
                                                                        category}
                                                                </span>
                                                            );
                                                        }
                                                    )}
                                                </div>

                                                <div className="text-sm z-10">
                                                    {event.cost === "0"
                                                        ? "Бесплатно"
                                                        : `${event.cost}`}
                                                </div>
                                                <div className="text-sm text-gray-300 max-w-[450px]">
                                                    {" "}
                                                    {event.city}
                                                </div>
                                            </div>

                                            {/* Описание с кнопкой Подробнее */}
                                            <div className="text-sm text-gray-300 leading-relaxed">
                                                {activeEvent === event.id
                                                    ? event.description
                                                    : ""}
                                            </div>

                                            <div className="flex flex-col sm:flex-row md:flex-col gap-2 mt-4 md:mt-0 md:ml-auto w-full sm:w-auto">
                                                {event.is_registration_open &&
                                                    event.registration_link && (
                                                        <a
                                                            href={
                                                                event.registration_link
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-green-400 text-white px-3 py-2 text-[13px] text-center sm:text-[16px] sm:px-4 sm:py-2 rounded-md font-semibold hover:bg-green-500 transition w-full sm:w-auto"
                                                        >
                                                            Регистрация
                                                        </a>
                                                    )}
                                                <Link
                                                    href={`/tournaments/${event.slug}`}
                                                >
                                                    <button className="bg-white text-black px-3 py-2 text-[13px] sm:text-[16px] sm:px-6 sm:py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto">
                                                        Подробнее
                                                    </button>
                                                </Link>
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
