import React from 'react'
import { Button } from '@/components/ui/button'
import logoImage from '../../public/assets/logo.svg'
import Image from 'next/image'

const Hero = () => {
  return (
<section className="w-full py-8">
  <div className="px-4 md:px-10 lg:px-20">
    <div className="bg-primary rounded-2xl px-5 py-8 md:px-8 md:py-10 flex flex-col md:flex-row justify-between items-center">
      
      {/* Левая часть: текст и кнопка */}
      <div className="md:w-[70%] w-full space-y-4">
        <h1 className="text-white text-[32px] md:text-[36px] font-bold leading-tight tracking-tight mb-6">
          <span className="inline-flex items-center gap-3">
            <Image src={logoImage} alt="QDeb Logo"/>
            <span>— это центральная платформа,</span>
          </span>
          <br />
          соединяющая дебатеров, клубы и турниры
          <br />
          по всему Казахстану.
        </h1>
        <Button className="bg-[#FF6A1D] hover:bg-[#ff7d3b] text-white text-sm font-semibold px-5 py-3 rounded-md">
          Узнать больше о проекте
        </Button>
      </div>

      {/* Правая часть: слайдер позже */}
    </div>

    {/* Индикатор слайдера */}
    <div className="flex justify-center gap-2">
      <span className="w-12 h-[3px] bg-white rounded-full" />
      <span className="w-8 h-[3px] bg-white/30 rounded-full" />
      <span className="w-8 h-[3px] bg-white/30 rounded-full" />
    </div>
  </div>
</section>


  )
}

export default Hero
