"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { slidesData } from "../../lib/sharedHeroData";

const MobileHero = () => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full py-4 relative mobilehero">
      <div className="px-3 md:px-10 lg:px-16">
        <div className="relative rounded-2xl overflow-hidden bg-primary">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {slidesData.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-[260px] flex flex-col  overflow-hidden justify-between items-center text-center px-4 py-4">
                  {/* Background */}
                  <Image
                    src="/assets/banner-blue.png"
                    alt="Background"
                    fill
                    className="object-cover z-0"
                    priority
                  />
                  {slide.id === 1 && (
                    <Image
                      src="/assets/traced-image.png"
                      alt="Hedgehog"
                      width={160}
                      height={160}
                      className="absolute bottom-20 -right-10 z-10 w-[200px] h-[150px] md:w-[300px] md:bottom-0 md:-right-16 md:h-[200px]"
                    />
                  )}

                  {/* Text content */}
                  <div className="relative z-10 w-full flex flex-col flex-grow justify-between items-start text-left">
                    <div className="space-y-2 max-w-[290px] md:max-w-[900px] w-full pt-4">
                      <h1 className="text-white text-[22px] md:text-[34px] font-semibold leading-snug tracking-tight">
                        {slide.logo ? (
                          <div className="flex items-center gap-2">
                            {/* <Image
                              src={slide.logo}
                              alt="QDeb Logo"
                              width={80}
                              height={80}
                              className="shrink-0 m-0 p-0 align-middle"
                            /> */}
                            <span className="text-white text-[22px] md:text-[34px] font-bold leading-snug tracking-tight">
                              <span className="font-involve">QDeb</span>
                              {slide.titleLine1}
                            </span>
                          </div>
                        ) : (
                          <span className="text-white text-[22px] md:text-[34px] font-bold leading-snug tracking-tight">
                            {slide.titleLine1}
                          </span>
                        )}
                        <span className="font-bold">{slide.titleLine2}</span>
                        <span className="font-bold">{slide.titleLine3}</span>
                      </h1>
                    </div>

                    <div className="w-full max-w-[280px] mb-2">
                      <Button className="bg-[#FF6A1D] hover:bg-[#ff7d3b] text-white text-sm font-bold px-5 py-3 rounded-md w-full">
                        {slide.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Slider dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {slidesData.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperRef.current?.slideToLoop(index)}
                className={`transition-all duration-300 bg-white rounded-full ${
                  activeIndex === index
                    ? "w-20 h-1 opacity-100"
                    : "w-20 h-1 opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
