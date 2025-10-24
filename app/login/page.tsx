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
import { safeParseResponse } from "@/lib/api";
//

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
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
      const parseResult = await safeParseResponse(res);
      
      if (parseResult.error) {
        console.error("Failed to parse profile response:", parseResult.error);
        return;
      }
      
      if (!parseResult.isJson) {
        console.warn("Non-JSON response from profile:", parseResult.data);
        return;
      }
      
      useUserStore.getState().setUser({
        email: "",
        full_name: "",
        avatar: "",
        phone: "",
        description: "",
        roles: [],
      });
      return;
    }
    console.error("Не удалось получить профиль пользователя");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Attempting login with:", { username, password: "***" });
    console.log("API URL:", `${API_URL}/auth/signin`);
    console.log("Request body:", JSON.stringify({ username, password: "***" }));

    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log("Login response status:", res.status);

      if (res.ok) {
        const parseResult = await safeParseResponse(res);
        
        if (parseResult.error) {
          console.error("Failed to parse login response:", parseResult.error);
          toast.error("Ошибка обработки ответа сервера");
          return;
        }
        
        if (!parseResult.isJson) {
          console.warn("Non-JSON response from login:", parseResult.data);
          toast.error("Неожиданный формат ответа сервера");
          return;
        }
        
        const data = parseResult.data as { token: string };

        toast.success("Успешный вход!");

        Cookies.set("accessToken", data.token, {
          expires: rememberDevice ? 7 : 1,
        });

        await fetchProfile(data.token);

        router.push("/");
      } else {
        // Handle error response using safe parsing
        let message = "Ошибка входа. Проверьте данные.";
        const parseResult = await safeParseResponse(res);
        
        if (parseResult.error) {
          console.error("Error parsing error response:", parseResult.error);
          message = parseResult.error;
        } else if (typeof parseResult.data === "string") {
          message = parseResult.data;
        } else if (parseResult.data && typeof parseResult.data === "object") {
          const errorData = parseResult.data as Record<string, unknown>;
          message = String(errorData.detail || errorData.message || errorData.error || message);
        }
        
        toast.error(message);
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
              <Label htmlFor="username" className="text-lg">
                Никнейм
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Никнейм"
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

