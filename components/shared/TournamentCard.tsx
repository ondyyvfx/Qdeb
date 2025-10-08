import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export type TournamentCardProps = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  cost: number;
  location: string;
  registrationlink: string | null;
  backgroundUrl: string;
};

const TournamentCard = (props: TournamentCardProps) => {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const sameDay = startDate.toDateString() === endDate.toDateString();

    if (sameDay) {
      return startDate.toLocaleDateString("ru-RU", options);
    } else {
      const sameMonthYear =
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear();

      if (sameMonthYear) {
        const dayRange = `${startDate.getDate()}–${endDate.getDate()}`;
        const monthYear = endDate.toLocaleDateString("ru-RU", {
          month: "long",
          year: "numeric",
        });
        return `${dayRange} ${monthYear}`;
      } else {
        return `${startDate.toLocaleDateString(
          "ru-RU",
          options
        )} – ${endDate.toLocaleDateString("ru-RU", options)}`;
      }
    }
  };

  return (
    <div
      className="bg-primary rounded-xl text-white p-0 flex flex-col justify-between w-full h-[220px] md:h-[220px] lg:h-[230px] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/10 overflow-hidden" // Увеличиваем высоту карточки
      style={{
        backgroundImage: `url(${props.backgroundUrl})`,
        backgroundPosition: "left top", // Фото теперь в левом верхнем углу
        backgroundRepeat: "no-repeat",
        backgroundSize: "165px", // Размер фото фиксирован для корректного отображения
      }}
    >
      <div className="m-4 text-text rounded-lg p-4 flex flex-col gap-2 mt-6">
        <div className="flex items-baseline">
          <Link href={`/tournaments/${props.id}`}>
            <h2 className="ml-2 text-2xl font-bold mb-0 truncate hover:text-accent cursor-pointer transition-colors">
              {props.title}
            </h2>
          </Link>
          <p className="text-sm mb-0 ml-4">
            {formatDateRange(props.start_date, props.end_date)}
          </p>
        </div>
        <p className="ml-2 text-sm mb-0.5">
          {props.cost ? `Price: ${props.cost}` : "Бесплатно"}
        </p>
        <p className="ml-2 text-sm mb-0">{props.location} </p>
        <div className="ml-2 mt-5 flex gap-2">
          <Button
            className="text-black bg-white hover:bg-gray-100 w-32 h-9 font-bold transition-all duration-300 transform hover:scale-105"
            size="sm"
          >
            <Link href={`/tournaments/${props.id}`}>Подробнее</Link>
          </Button>
          {props.registrationlink && (
            <Button
              className="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 w-32 h-9 font-bold transition-all duration-300 transform hover:scale-105"
              size="sm"
            >
              <Link href={props.registrationlink} target="_blank" rel="noopener noreferrer">
                Регистрация
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
