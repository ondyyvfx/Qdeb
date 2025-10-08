"use client";

import React, { useEffect, useState } from "react";
import TournamentCard from "./TournamentCard";
import Cookies from "js-cookie";
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
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api";

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
        console.log("API response:", data);

        const arr = Array.isArray(data) ? data : [];
        const formatted = arr.map((t: any) => ({
          id: t.id,
          title: t.name,
          start_date: t.eventDate,
          end_date: t.eventDate,
          cost: t.fee,
          location: t.organizerName || "",
          registrationlink: t.tabbycatUrl || null,
          backgroundUrl: "/assets/Q.svg",
        }));
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
          <SwiperSlide key={card.id}>
            <TournamentCard {...card} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MobileTournamentSlider;
