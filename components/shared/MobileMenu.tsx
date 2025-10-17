// components/MobileMenu.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DrawerTitle, DrawerHeader } from "@/components/ui/drawer";
import Image from "next/image";
import { User } from "@/stores/useUserStore";

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
    <>
      <DrawerHeader>
        <DrawerTitle className="">
          Follow Qdeb in telegram <span className="text-2xl">☺</span>
        </DrawerTitle>
      </DrawerHeader>

      <div className="flex flex-col gap-4 p-4">
        <Link href="/" onClick={() => onNavigate("/")}>
          Главная
        </Link>
        <Link href="/tournaments" onClick={() => onNavigate("/tournaments")}>
          Турниры
        </Link>
        <Link href="/calendar" onClick={() => onNavigate("/calendar")}>
          Календарь турниров
        </Link>
        <Link href="/rating" onClick={() => onNavigate("/rating")}>
          Рейтинг спикеров
        </Link>
        <Link href="/about" onClick={() => onNavigate("/about")}>
          О нас
        </Link>
        {user?.roles?.includes("ROLE_ADMIN") && (
          <Link
            href="/tournaments/create"
            onClick={() => onNavigate("/tournaments/create")}
            className="text-orange-500 font-semibold"
          >
            Создать турнир
          </Link>
        )}

        {user ? (
          <>
            {/* Информация о пользователе */}
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg mb-2">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-white/20">
                  <span className="text-white font-bold text-sm">
                    {getUserInitials(user)}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">
                  {formatUserName(user)}
                </span>
                <span className="text-gray-400 text-xs">{user.email}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => onNavigate("/profile")}
              className="justify-start"
            >
              Профиль
            </Button>
            <Button
              variant="destructive"
              onClick={onLogout}
              className="justify-start"
            >
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button className="w-full" onClick={() => onNavigate("/login")}>
              Войти
            </Button>
            <Button className="w-full" onClick={() => onNavigate("/register")}>
              Зарегистрироваться
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default MobileMenu;
