"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import logoImage from "../../public/assets/logo.svg";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";
import Link from "next/link";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const Navbar = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="w-full bg-background text-text border-b border-white/10 flex justify-center sticky top-0 z-50">
      <div className="w-full my-3.5 py-4 flex items-center justify-between px-4 md:px-20">
        <Link href="/" passHref>
          <Image src={logoImage} alt="QDeb Logo" width={90} height={25} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link
            href="/calendar"
            className="hover:text-accent transition-colors"
          >
            Календарь мероприятий
          </Link>
          <Link href="/rating" className="hover:text-accent transition-colors">
            Рейтинг спикеров
          </Link>
          <Link href="#" className="hover:text-accent transition-colors">
            О нас
          </Link>
        </nav>

        {/* Desktop user avatar or login */}
        <div className="hidden md:flex items-center relative" ref={menuRef}>
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
                  className="h-10 w-10 rounded-full object-cover border"
                />
              )}
              <span className="text-sm font-medium text-white">
                {user.full_name}
              </span>
            </div>
          ) : (
            <>
              <Button
                onClick={() => router.push("/login")}
                variant="default"
                className="border border-accent bg-background text-white hover:bg-orange-500 transition-colors py-5 px-6"
              >
                Sign in
              </Button>
              <Button
                onClick={() => router.push("/register")}
                variant="default"
                className="border border-accent bg-background text-white hover:bg-orange-500 transition-colors py-5 px-6 ml-2"
              >
                Sign up
              </Button>
            </>
          )}

          {menuOpen && user && (
            <div className="absolute right-0 mt-3 bg-background border border-white/10 rounded-lg shadow-md p-3 z-50 min-w-[160px]">
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
