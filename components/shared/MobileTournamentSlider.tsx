"use client";

import React, { useEffect, useState } from "react";
import TournamentCard from "./TournamentCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface Tournament {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  cost: number;
  location: string;
  registrationlink: string | null;
  backgroundUrl: string;
}

const MobileTournamentSlider = () => {
  const [cards, setCards] = useState<Tournament[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/nearest/10/`
        );

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          const text = await res.text();
          console.error("Ошибка ответа сервера:", res.status, text);
          throw new Error(`Некорректный ответ сервера: ${res.status}`);
        }

        const data = await res.json();
        console.log("API response:", data);

        if (Array.isArray(data.results)) {
          const formatted = data.results.map((event: any) => ({
            id: event.id,
            title: event.title,
            start_date: event.start_date,
            end_date: event.end_date,
            cost: event.cost,
            location: event.city,
            registrationlink: event.registration_link,
            backgroundUrl: "/assets/Q.svg",
          }));
          setCards(formatted);
        } else {
          console.error("Ожидался массив, но получено:", data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке турниров:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="my-14 px-2 xl:px-20">
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        centeredSlides={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
        }}
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id}>
            <TournamentCard {...card} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MobileTournamentSlider;
