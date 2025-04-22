'use client'
import { useEffect } from "react";
import { getUserFromCookie } from "@/lib/getUserFromCookie";

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    getUserFromCookie();
  }, []);

  return <>{children}</>;
};
