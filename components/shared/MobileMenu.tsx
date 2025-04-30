// components/MobileMenu.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DrawerTitle, DrawerHeader } from "@/components/ui/drawer";

type User = {
  full_name: string;
  avatar?: string;
};

type MobileMenuProps = {
  user: User | null;
  onLogout: () => void;
  onNavigate: (path: string) => void;
};

const MobileMenu = ({ user, onLogout, onNavigate }: MobileMenuProps) => {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="">
          Follow Qdeb in telegram <span className="text-2xl">☺</span>
        </DrawerTitle>
      </DrawerHeader>

      <div className="flex flex-col gap-4 p-4">
        <Link href="/calendar" onClick={() => onNavigate("/calendar")}>
          Календарь мероприятий
        </Link>
        <Link href="#" onClick={() => onNavigate("/speakers")}>
          Рейтинг спикеров
        </Link>
        <Link href="#" onClick={() => onNavigate("/about")}>
          О нас
        </Link>

        {user ? (
          <>
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
          <Button className="w-full" onClick={() => onNavigate("/login")}>
            Войти
          </Button>
        )}
      </div>
    </>
  );
};

export default MobileMenu;
