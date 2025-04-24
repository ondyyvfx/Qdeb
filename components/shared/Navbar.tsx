'use client';

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import logoImage from '../../public/assets/logo.svg';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import Cookies from 'js-cookie';

const Navbar = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // -------------------- Обработка клика вне дропдауна, чтобы он закрывался
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --------------------- Выход из аккаунта: удаляем куки и Zustand
  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
    router.push('/');
  };


  return (
    <header className="w-full bg-background text-text border-b border-white/10 flex justify-center">
      <div className="w-full my-3.5 py-4 flex items-center justify-between mx-19">
        <div className="flex">
          <a href='/'>
          <Image src={logoImage} alt="QDeb Logo" width={90} height={25} />
          </a>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="/calendar" className="hover:text-accent transition-colors mx-4">Календарь мероприятий</a>
          <a href="#" className="hover:text-accent transition-colors mx-4">Рейтинг спикеров</a>
          <a href="#" className="hover:text-accent transition-colors mx-4">О нас</a>
        </nav>

        <div className="flex-shrink-0 relative" ref={menuRef}>
          {user ? (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
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

          {/*------------- Выпадающее меню: отображается только при menuOpen */}
          {menuOpen && user && (
            <div className="absolute right-0 mt-3 bg-background border border-white/10 rounded-lg shadow-md p-3 z-50 min-w-[160px]">
              <button
                onClick={() => {
                  router.push('/profile');
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-accent rounded-md text-sm text-white"
              >
                Профиль
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-600 rounded-md text-sm text-white mt-1"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
