"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore } from "@/stores/useUserStore";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const fetchProfile = async (accessToken: string) => {
    const res = await fetch("http://localhost:8000/api/auth/profile/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      useUserStore.getState().setUser(data);
    } else {
      console.error("Не удалось получить профиль пользователя");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const getCsrfToken = async () => {
      const res = await fetch("http://localhost:8000/api/csrf/", {
        credentials: "include",
      });
      const data = await res.json();
      return data.csrfToken;
    };

    const csrfToken = await getCsrfToken();

    const res = await fetch("http://localhost:8000/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Успешный вход:", data);

      Cookies.set("accessToken", data.access, { expires: 1 });
      Cookies.set("refreshToken", data.refresh, { expires: 7 });

      await fetchProfile(data.access);

      router.push("/");
    } else {
      const error = await res.json();
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <div className="login-form flex min-h-screen bg-[#070A12] text-foreground">
      {/* Левая сторона с баннером */}
      <div className="hidden md:flex w-1/2 items-center justify-center overflow-hidden animate-fade-in p-6">
        <div className="w-full h-full relative rounded-2xl overflow-hidden">
          <Image
            src="/assets/banner.png"
            alt="Banner"
            fill
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Правая сторона с формой */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 animate-fade-in">
        <div className="w-full max-w-md p-10 rounded-3xl shadow-lg bg-muted">
          <h1 className="text-2xl font-bold text-center mb-8">
            Вход в аккаунт
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 rounded-lg"
              />
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-baseline">
                <Label htmlFor="password" className="text-sm font-medium">
                  Пароль
                </Label>
                <p className="text-sm text-center text-muted-foreground m-0 p-0 leading-none flex justify-end right-0">
                  Забыли пароль?
                </p>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 rounded-lg pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-10 right-3 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-accent hover:bg-accent/90 text-white font-semibold text-base"
            >
              Войти
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
