"use client";

import React, { useEffect, useState } from "react";
import TournamentCard from "./TournamentCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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

const MobileTournamentSlider = () => {
  const [cards, setCards] = useState<Tournament[]>([]);
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = `${API_URL}/tournaments`;
        const res = await fetch(url);

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
            t.photoUrl || t.pictureUrl || t.imageURL || t.imageUrl || "";
          const resolvedBackground = imagePath
            ? `${API_URL.replace("/api", "")}${imagePath}`
            : "/assets/Q.svg";

          return {
            id: t.id,
            slug,
            title: t.name || t.title || slug,
            start_date: t.date || t.startDate || t.eventDate,
            end_date: t.date || t.endDate || t.eventDate,
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
          <SwiperSlide key={card.slug}>
            <TournamentCard {...card} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MobileTournamentSlider;
