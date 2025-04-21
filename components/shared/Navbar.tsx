'use client';

import Image from 'next/image';
import React from 'react';
import logoImage from '../../public/assets/logo.svg';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore'; // 👈 добавляем Zustand

const Navbar = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user); // 👈 получаем текущего юзера

  return (
    <header className="w-full bg-background text-text border-b border-white/10 flex justify-center">
      <div className="w-full my-3.5 py-4 flex items-center justify-between mx-19">
        <div className="flex">
          <Image src={logoImage} alt="QDeb Logo" width={90} height={25} />
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-accent transition-colors mx-4">Календарь мероприятий</a>
          <a href="#" className="hover:text-accent transition-colors mx-4">Рейтинг спикеров</a>
          <a href="#" className="hover:text-accent transition-colors mx-4">О нас</a>
        </nav>

        <div className="flex-shrink-0">
          {user ? (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => router.push('/profile')} // 👈 переход в личный кабинет
            >
              {user.avatar && (
                <Image
                  src={user.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-white">{user.full_name}</span>
            </div>
          ) : (
            <Button
              onClick={() => router.push('/login')}
              variant="default"
              className="border border-accent bg-background text-white hover:bg-orange-500 transition-colors py-5 px-6"
            >
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
