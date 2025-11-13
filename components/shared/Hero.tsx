"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { slidesData } from "../../lib/sharedHeroData";

import Link from "next/link";

const Hero = () => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="hero w-full py-8 relative ">
      <div className="px-4 md:px-10 lg:px-20">
        <div className="relative">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="bg-primary rounded-2xl overflow-hidden relative"
          >
            {slidesData.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:pr-20 flex flex-col md:flex-row justify-between items-center min-h-[280px]">
                  {slide.id === 1 && (
                    <Image
                      src="/assets/banner-hedgehog.png"
                      alt="Hedgehog Background"
                      fill
                      className=""
                      priority
                    />
                  )}
                  {(slide.id === 2 || slide.id === 3) && (
                    <Image
                      src="/assets/banner-blue.png"
                      alt="Blue Background"
                      fill
                      className="object-cover z-0"
                      priority
                    />
                  )}
                  <div className="md:w-[70%] w-full space-y-4 text-center md:text-left relative z-10">
                    <h1 className="text-white text-[36px] font-bold leading-snug tracking-tight mb-6">
                      {slide.logo && (
                        <span className="inline-flex items-center gap-3 mb-2">
                          <span className="font-involve font-medium text-4xl">
                            QDeb
                          </span>
                          <span>{slide.titleLine1}</span>
                        </span>
                      )}
                      {!slide.logo && (
                        <span className="inline-block -mb-20">
                          {slide.titleLine1}
                        </span>
                      )}
                      <br />
                      {slide.titleLine2}
                      <br />
                      {slide.titleLine3}
                    </h1>
                    <Link href={`/${slide.buttonHref}`}>
                      <Button className="bg-[#FF6A1D] hover:bg-[#ff7d3b] text-white text-sm font-semibold px-5 py-3 rounded-md w-full sm:w-auto">
                        {slide.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Индикаторы пагинации - полностью скрыты на мобильных (до 768px), видны только на планшетах и десктопе */}
          <div className="hero-pagination-container absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-row gap-1.5 md:gap-2">
            {slidesData.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => swiperRef.current?.slideToLoop(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
                className={`hero-pagination-dot transition-all duration-300 bg-white rounded-full ${
                  activeIndex === index
                    ? "h-1 w-10 md:w-20 opacity-100"
                    : "h-1 w-10 md:w-20 opacity-40 hover:opacity-60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
