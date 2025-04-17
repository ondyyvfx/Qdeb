// 'use client'

import Image from 'next/image'
import React from 'react'
import logoImage from '../../public/assets/logo.svg'
import { Button } from '../ui/button'

const Navbar = () => {
  return (
    <header className="w-full bg-background text-text border-b border-white/10">
      <div className="container my-3.5 mx-auto py-4 flex items-center justify-between">
        <div className="flex">
          <Image src={logoImage} alt="QDeb Logo" width={120} height={40} />
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-accent transition-colors">Календарь мероприятий</a>
          <a href="#" className="hover:text-accent transition-colors">Рейтинг спикеров</a>
          <a href="#" className="hover:text-accent transition-colors">О нас</a>
        </nav>

        <div className="flex-shrink-0">
          <Button variant="default" className="border border-accent bg-background text-white hover:bg-orange-500 transition-colors py-5 px-6">
            Войти
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
