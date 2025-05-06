import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export type TournamentCardProps = {
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
      className="bg-primary rounded-lg text-white p-0 flex flex-col justify-between w-full h-[220px] md:h-[220px] lg:h-[230px]" // Увеличиваем высоту карточки
      style={{
        backgroundImage: `url(${props.backgroundUrl})`,
        backgroundPosition: "left top", // Фото теперь в левом верхнем углу
        backgroundRepeat: "no-repeat",
        backgroundSize: "165px", // Размер фото фиксирован для корректного отображения
      }}
    >
      <div className="m-4 text-text rounded-lg p-4 flex flex-col gap-2 mt-6">
        <div className="flex items-baseline">
          <h2 className="ml-2 text-2xl font-bold mb-0 truncate">
            {props.title}
          </h2>
          <p className="text-sm mb-0 ml-4">
            {formatDateRange(props.start_date, props.end_date)}
          </p>
        </div>
        <p className="ml-2 text-sm mb-0.5">
          {props.cost ? `Price: ${props.cost}` : "Бесплатно"}
        </p>
        <p className="ml-2 text-sm mb-0">{props.location} </p>
        <Button
          className="ml-2 mt-5 text-black bg-white hover:bg-white w-40 h-9 font-bold"
          size="sm"
        >
          <Link href={props.registrationlink || "#"}>Регистрация</Link>
        </Button>
      </div>
    </div>
  );
};

export default TournamentCard;
