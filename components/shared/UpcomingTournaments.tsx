"use client";

import React, { useEffect, useState, useRef } from "react";
import TournamentCard from "./TournamentCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper";
import { Navigation } from "swiper/modules";
import MobileTournamentSlider from "./MobileTournamentSlider";

const NUMBER_OF_EVENTS = 10;

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

const UpcomingTournaments = () => {
  const [cards, setCards] = useState<Tournament[]>([]);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `https://qdeb.kz/api/events/nearest/${NUMBER_OF_EVENTS}/`
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

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update();
      swiperRef.current.slideTo(0);
    }
  }, [cards]);

  return (
    <div className="my-14 px-3 md:px-10 xl:px-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ближайшие турниры</h1>
        <a href="/calendar" className="text-sm text-blue-500 hover:underline">
          Посмотреть все
        </a>
      </div>

      {/* Мобильная версия */}
      <div className="md:hidden">
        <MobileTournamentSlider />
      </div>

      {/* Десктопная версия */}
      <div className="relative hidden md:block">
        <div className="swiper-button-prev-tournaments absolute -left-8 z-10 bg-transparent border shadow-lg p-3 rounded-full top-1/2 -translate-y-1/2 hover:bg-white transition">
          <ChevronLeft className="w-6 h-6 text-white" />
        </div>

        <div className="swiper-button-next-tournaments absolute -right-8 z-10 bg-transparent border shadow-lg p-3 rounded-full top-1/2 -translate-y-1/2 hover:bg-white transition">
          <ChevronRight className="w-6 h-6 text-white" />
        </div>

        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={24}
          slidesPerView={1.2}
          centeredSlides={false}
          watchSlidesProgress
          observer={true}
          observeParents={true}
          updateOnWindowResize={true}
          breakpoints={{
            640: {
              slidesPerView: 1.8,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3.1,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 3.2,
              spaceBetween: 24,
            },
          }}
          navigation={{
            prevEl: ".swiper-button-prev-tournaments",
            nextEl: ".swiper-button-next-tournaments",
          }}
        >
          {cards.map((card) => (
            <SwiperSlide key={card.id} className="!w-[30%]">
              <TournamentCard {...card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default UpcomingTournaments;
