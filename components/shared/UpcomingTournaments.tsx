"use client";

import React, { useEffect, useState, useRef } from "react";
import TournamentCard from "./TournamentCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Swiper as SwiperCore } from "swiper";
import { Navigation } from "swiper/modules";
import MobileTournamentSlider from "./MobileTournamentSlider";
import { resolveTournamentPictureUrl } from "@/lib/tournamentPicture";
import { useLanguage } from "@/contexts/LanguageContext";

interface Tournament {
  id: number;
  slug: string;
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
  const { t } = useLanguage();
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/tournaments`);

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          setCards([]);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.results)
          ? (data as any).results
          : [];

        const formatted = list.map((t: any) => {
          const slug = t.slug || String(t.id);
          const imagePath =
            t.photoUrl || t.pictureUrl || t.imageURL || t.imageUrl || t.tournamentPicture || "";
          
          // Формируем правильный URL для изображения турнира
          const resolvedBackground = resolveTournamentPictureUrl(imagePath) || "/assets/default-avatar.svg";

          return {
            id: t.id,
            slug,
            title: t.name || t.title || slug,
            start_date: t.startDate || t.date || t.eventDate || "",
            end_date: t.endDate || t.date || t.eventDate || "",
            cost:
              typeof t.fee === "number"
                ? t.fee
                : Number.parseFloat(t.fee ?? "0") || 0,
            location: t.organizerName || t.city || "Location to be announced",
            registrationlink: t.tabbycatUrl || t.registrationLink || null,
            backgroundUrl: resolvedBackground,
          } as Tournament;
        });
        setCards(formatted);
      } catch (error) {
        setCards([]);
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
        <h1 className="text-3xl font-bold">{t.home.upcomingTournaments}</h1>
        <a href="/calendar" className="text-sm text-blue-500 hover:underline">
          {t.home.viewAll}
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
            <SwiperSlide key={card.slug} className="!w-[30%]">
              <TournamentCard
                id={card.id}
                slug={card.slug}
                title={card.title}
                start_date={card.start_date}
                end_date={card.end_date}
                cost={card.cost}
                location={card.location}
                registrationlink={card.registrationlink}
                backgroundUrl={card.backgroundUrl}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default UpcomingTournaments;
