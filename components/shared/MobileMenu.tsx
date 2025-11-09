// components/MobileMenu.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DrawerTitle, DrawerHeader } from "@/components/ui/drawer";
import Image from "next/image";
import { User } from "@/stores/useUserStore";
import { Separator } from "@/components/ui/separator";

type MobileMenuProps = {
  user: User | null;
  onLogout: () => void;
  onNavigate: (path: string) => void;
};

const MobileMenu = ({ user, onLogout, onNavigate }: MobileMenuProps) => {
  // Функция для форматирования имени пользователя
  const formatUserName = (user: { full_name?: string; email?: string }) => {
    if (user.full_name) {
      return user.full_name;
    }
    if (user.email) {
      const nameFromEmail = user.email.split("@")[0];
      return nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    }
    return "Пользователь";
  };

  // Функция для получения инициалов пользователя
  const getUserInitials = (user: { full_name?: string; email?: string }) => {
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();
    }
    if (user.email) {
      const nameFromEmail = user.email.split("@")[0];
      return nameFromEmail.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="flex flex-col h-full">
      <DrawerHeader className="border-b border-white/10 pb-4">
        <DrawerTitle className="text-xl font-bold text-white">
          Меню
        </DrawerTitle>
      </DrawerHeader>

      <div className="flex flex-col flex-1 overflow-y-auto p-4 gap-2">
        {/* Навигационные ссылки */}
        <nav className="flex flex-col gap-2 mb-4">
          <Link
            href="/calendar"
            onClick={() => onNavigate("/calendar")}
            className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white font-medium"
          >
            Календарь
          </Link>
          
          {user?.roles?.includes("ROLE_ADMIN") && (
            <Link
              href="/tournaments"
              onClick={() => onNavigate("/tournaments")}
              className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white font-medium"
            >
              Турниры
            </Link>
          )}
          
          <Link
            href="/rating"
            onClick={() => onNavigate("/rating")}
            className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white font-medium"
          >
            Рейтинг спикеров
          </Link>
          
          <Link
            href="/about"
            onClick={() => onNavigate("/about")}
            className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-white font-medium"
          >
            О нас
          </Link>
          
          {user?.roles?.includes("ROLE_ADMIN") && (
            <Link
              href="/tournaments/create"
              onClick={() => onNavigate("/tournaments/create")}
              className="px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-orange-500 font-semibold"
            >
              Создать турнир
            </Link>
          )}
        </nav>

        <Separator className="my-2 bg-white/10" />

        {/* Пользовательская секция */}
        {user ? (
          <>
            {/* Информация о пользователе */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg mb-4">
              {user.avatar && user.avatar.trim() !== "" ? (
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <Image
                    src={user.avatar}
                    alt="avatar"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-2 border-white/20 shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {getUserInitials(user)}
                  </span>
                </div>
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-white font-semibold text-base truncate">
                  {formatUserName(user)}
                </span>
                {user.email && (
                  <span className="text-gray-400 text-xs truncate">
                    {user.email}
                  </span>
                )}
              </div>
            </div>

            {/* Кнопки действий пользователя */}
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={() => onNavigate("/profile")}
                className="justify-start w-full text-white hover:bg-white/10 h-12"
              >
                Профиль
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => onNavigate("/team")}
                className="justify-start w-full text-white hover:bg-white/10 h-12"
              >
                Моя команда
              </Button>
              
              <Separator className="my-2 bg-white/10" />
              
              <Button
                variant="ghost"
                onClick={onLogout}
                className="justify-start w-full text-red-400 hover:bg-red-500/20 hover:text-red-300 h-12"
              >
                Выйти
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 mt-auto">
            <Button
              variant="outline"
              onClick={() => onNavigate("/register")}
              className="w-full border-gray-600 bg-background text-white hover:bg-orange-500 hover:border-accent transition-colors h-12"
            >
              Регистрация
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate("/login")}
              className="w-full text-white hover:bg-white/10 h-12"
            >
              Вход
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
