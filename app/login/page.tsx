"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore } from "@/stores/useUserStore";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
//

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  const router = useRouter();

  const fetchProfile = async (accessToken: string) => {
    const res = await fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      useUserStore.getState().setUser(data);
      return;
    }
    console.error("Не удалось получить профиль пользователя");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        toast.success("Успешный вход!");

        Cookies.set("accessToken", data.token, {
          expires: rememberDevice ? 7 : 1,
        });

        await fetchProfile(data.token);

        router.push("/");
      } else {
        const error = await res.json();
        toast.error(error?.detail || "Ошибка входа. Проверьте данные.");
      }
    } catch (err) {
      toast.error("Произошла ошибка. Попробуйте снова.");
      console.error(err);
    }
  };

  return (
    <div className="login-form flex min-h-screen bg-[#070A12] text-foreground">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Левая сторона с картинкой */}
      <div className="hidden md:flex w-1/2 items-center justify-center overflow-hidden animate-fade-in p-6">
        <div className="relative w-full h-full bg-primary rounded-2xl overflow-hidden">
          <Image
            src="/assets/banner.png" // путь к твоей картинке
            alt="Login Banner"
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Правая сторона с формой */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-12 md:p-24 animate-fade-in">
        <div className="w-full">
          <Link href="/" className="">
            <X className="absolute right-[5%] top-[7%] w-5 h-5 text-white" />
          </Link>
          <h1 className="text-4xl text-center mb-10 font-bold">
            Войдите в аккаунт
          </h1>
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-lg">
                Электронная почта
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="border-gray-700 bg-gray-900 focus-visible:border-accent focus-visible:ring-accent h-[60px] rounded-xl"
              />
            </div>

            <div className="space-y-3 relative">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-lg">
                  Пароль
                </Label>
                <a href="#" className="text-sm text-accent hover:underline">
                  Забыли пароль?
                </a>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="border-gray-700 bg-gray-900 focus-visible:border-accent focus-visible:ring-accent h-[60px] rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-14 right-4 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>

            {/* Чекбокс */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember"
                checked={rememberDevice}
                onCheckedChange={(checked) => setRememberDevice(!!checked)}
              />
              <Label htmlFor="remember" className="text-sm">
                Запомнить это устройство
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-lg"
            >
              Войти
            </Button>

            <div className="flex justify-center text-base">
              <span className="text-muted-foreground">
                Нет учетной записи?&nbsp;
              </span>
              <a
                href="/register"
                className="text-accent hover:underline font-medium"
              >
                Создайте аккаунт
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
