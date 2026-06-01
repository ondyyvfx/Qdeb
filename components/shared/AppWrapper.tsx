"use client";
import { useEffect, useRef } from "react";
import { useUserStore, type User } from "@/stores/useUserStore";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const AppWrapper = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) => {
  const setUser = useUserStore((s) => s.setUser);
  const hasPreloadedRef = useRef(false);

  useEffect(() => {
    if (!hasPreloadedRef.current) {
      if (initialUser) {
        setUser(initialUser);
      }
      hasPreloadedRef.current = true;
    }
  }, [initialUser, setUser]);

  return <LanguageProvider>{children}</LanguageProvider>;
};
