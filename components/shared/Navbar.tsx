"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect, useCallback } from "react";
import logoImage from "../../public/assets/logo.svg";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";
import Link from "next/link";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface UserProfileResponse {
  id: number;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  description?: string;
  profilePictureUrl?: string;
  elo_rating?: number;
  tournaments_completed?: number;
  avg_speech?: number;
  total_achievements?: number;
  roles?: string[];
}

const Navbar = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const apiBase =
    (process.env.NEXT_PUBLIC_API_URL as string) || "http://localhost:4232/api";
  const resolveImageUrl = (url?: string | null) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // Согласно документации, изображения доступны через /api/files/profile-picture/{fileName}
    if (url.includes("profile-picture")) {
      return `${apiBase.replace("/api", "")}/api/files/profile-picture/${url}`;
    }
    // Для других файлов
    const normalized = url.startsWith("/") ? url : `/${url}`;
    return `${apiBase.replace("/api", "")}${normalized}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Mark hydration complete to avoid SSR/CSR mismatch when reading zustand
    setHasHydrated(true);
  }, []);

  // Получение полной информации о пользователе
  const fetchUserProfile = useCallback(async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        return;
      }

      // Получаем профиль текущего пользователя согласно документации
      const response = await fetch(`${apiBase}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Ошибка получения профиля:", response.status);
        return;
      }

      const data = await response.json();
      console.log("Navbar profile data:", data);
      console.log("Roles from API:", data.roles);

      // Если роли не пришли в обычном профиле, попробуем получить их через тестовый endpoint
      let roles = data.roles || [];
      if (!roles || roles.length === 0) {
        try {
          const testResponse = await fetch(`${apiBase}/test/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log("Test profile data:", testData);
            // Роли приходят как массив объектов {id, name}, нужно извлечь только name
            roles = testData.roles
              ? testData.roles.map((role: any) => role.name)
              : [];
          }
        } catch (testError) {
          console.log(
            "Не удалось получить роли через тестовый endpoint:",
            testError
          );
        }
      } else {
        // Если роли пришли в обычном профиле, проверим их формат
        if (roles.length > 0 && typeof roles[0] === "object") {
          roles = roles.map((role: any) => role.name);
        }
      }

      // Получаем данные команды отдельно
      let teamData = null;
      try {
        const teamResponse = await fetch(`${apiBase}/teams/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (teamResponse.ok) {
          teamData = await teamResponse.json();
        }
      } catch (teamError) {
        console.log("Пользователь не состоит в команде");
      }

      console.log("Final roles:", roles);
      console.log("Is admin:", roles.includes("ROLE_ADMIN"));

      const userData = {
        email: data.email || "",
        full_name: data.fullName || "",
        avatar: resolveImageUrl(data.profilePicture) || "",
        phone: data.phone || "",
        description: data.description || "",
        roles: roles,
        teamId: teamData?.id,
        teamName: teamData?.name,
        teamLeader: teamData?.leader?.id === data.id,
      };

      setUser(userData);
    } catch (error) {
      console.error("Ошибка при получении профиля пользователя:", error);
    }
  }, [setUser, apiBase]);

  // Автоматическое получение данных пользователя при загрузке страницы
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
    router.push("/");
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  // Функция для форматирования имени пользователя
  const formatUserName = (user: { full_name?: string; email?: string }) => {
    if (user.full_name) {
      return user.full_name;
    }
    if (user.email) {
      // Извлекаем имя из email (часть до @)
      const nameFromEmail = user.email.split("@")[0];
      // Делаем первую букву заглавной
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
    <header className="w-full bg-background text-text border-b border-white/10 flex justify-center sticky top-0 z-50">
      <div className="w-full my-3.5 py-4 flex items-center justify-between px-3 md:px-10 xl:px-19">
        <Link href="/" passHref>
          <Image src={logoImage} alt="QDeb Logo" width={90} height={25} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/calendar" className="hover:text-accent transition-colors">
            Calendar
          </Link>
          <Link href="/tournaments" className="hover:text-accent transition-colors">
            Tournaments
          </Link>
          <Link href="/rating" className="hover:text-accent transition-colors">
            Speaker Rating
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            About
          </Link>
          {hasHydrated && user?.roles?.includes("ROLE_ADMIN") && (
            <Link
              href="/tournaments/create"
              className="hover:text-orange-400 transition-colors text-orange-500 font-semibold"
            >
              Create Tournament
            </Link>
          )}
        </nav>

        {/* Desktop user avatar or login */}
        <div className="hidden md:flex items-center relative" ref={menuRef}>
          {!hasHydrated ? (
            <div className="h-10 w-[140px] rounded-md bg-white/10 animate-pulse" />
          ) : user ? (
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-lg px-2 py-1 transition-all duration-200"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white/20 shadow-lg hover:border-accent transition-all duration-200"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-white/20 shadow-lg hover:border-accent transition-all duration-200">
                  <span className="text-white font-bold text-lg">
                    {getUserInitials(user)}
                  </span>
                </div>
              )}
              <span className="text-base font-semibold text-white">
                {formatUserName(user)}
              </span>
            </div>
          ) : (
            <>
              {/* <Button
                onClick={() => router.push("/login")}
                variant="default"
                className="border border-accent bg-background text-white hover:bg-orange-500 transition-colors py-5 px-6"
              >
                Вход
              </Button> */}
              <Button
                onClick={() => router.push("/register")}
                variant="default"
                className="border border-gray-600 bg-background text-white hover:bg-orange-500 hover:border-accent transition-colors py-5 px-6 ml-2"
              >
                Регистрация
              </Button>
            </>
          )}

          {menuOpen && user && (
            <div className="absolute -right-5 mt-[150px] bg-background border border-white/10 rounded-lg shadow-md p-3 z-50 min-w-[160px]">
              <button
                onClick={() => {
                  router.push("/profile");
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

        {/* Mobile Drawer Menu */}
        <div className="md:hidden z-50">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={28} />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <MobileMenu
                user={user}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

