'use client';

import React, { useEffect, useState, useRef } from 'react';
import TournamentCard from './TournamentCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Swiper as SwiperCore } from 'swiper';
import { Navigation } from 'swiper/modules';

const NUMBER_OF_EVENTS = 10;

interface Tournament {
  id: number;
  title: string;
  date: string;
  cost: number;
  location: string;
  backgroundUrl: string;
}

const UpcomingTournaments = () => {
  const [cards, setCards] = useState<Tournament[]>([]);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/events/nearest/${NUMBER_OF_EVENTS}/`);
        const data = await res.json();

        const formatted = data.map((event: any) => {
          const rawDate = event.event_datetime.split('T')[0];
          const [year, month, day] = rawDate.split('-');
          return {
            id: event.id, 
            title: event.title,
            date: `${day}.${month}.${year}`,
            cost: event.cost,
            location: event.city,
            backgroundUrl: '/assets/Q.svg',
          };          
        });

        setCards(formatted);
      } catch (error) {
        console.error('Ошибка при загрузке турниров:', error);
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
    <div className="my-14 px-4 xl:px-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ближайшие турниры</h1>
        <a href="/calendar" className="text-sm text-blue-500 hover:underline">
          Посмотреть все
        </a>
      </div>

      <div className="relative">
        <div className="swiper-button-prev-custom absolute -left-8 z-10 bg-transparent border shadow-lg p-3 rounded-full top-1/2 -translate-y-1/2 hover:bg-white transition hidden md:flex">
          <ChevronLeft className="w-6 h-6 text-white" />
        </div>

        <div className="swiper-button-next-custom absolute -right-8 z-10 bg-transparent border shadow-lg p-3 rounded-full top-1/2 -translate-y-1/2 hover:bg-white transition hidden md:flex">
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
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
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