"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperCore } from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import SpeakerCard from "./SpeakerCard";

const SpeakerSlider = () => {
  const [speakers, setSpeakers] = useState<any[]>([]);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/speakers/", {
          cache: "no-store",
        });
        const data = await res.json();
        if (data && Array.isArray(data.results)) {
          setSpeakers(data.results);
        } else {
          console.error("Unexpected API format:", data);
        }
      } catch (error) {
        console.error("Error fetching speakers:", error);
      }
    };

    fetchSpeakers();
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update();
      swiperRef.current.slideTo(0);
    }
  }, [speakers]);

  return (
    <div className="relative">
      <div className="swiper-button-prev-speakers absolute -left-8 z-10 bg-transparent border shadow-lg p-3 rounded-full top-1/2 -translate-y-1/2 hover:bg-white transition hidden md:flex">
        <ChevronLeft className="w-6 h-6 text-white" />
      </div>

      <div className="swiper-button-next-speakers absolute -right-8 z-10 bg-transparent border shadow-lg p-3 rounded-full top-1/2 -translate-y-1/2 hover:bg-white transition hidden md:flex">
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
          prevEl: ".swiper-button-prev-speakers",
          nextEl: ".swiper-button-next-speakers",
        }}
      >
        {speakers.map((speaker) => (
          <SwiperSlide key={speaker.id || speaker.full_name}>
            <SpeakerCard
              full_name={speaker.full_name}
              avatar={speaker.avatar}
              elo_rating={speaker.elo_rating}
              achievements={speaker.achievements}
              avg_speech={speaker.avg_speech}
              total_achievements={speaker.total_achievements}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SpeakerSlider;
