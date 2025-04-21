"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore } from "@/stores/useUserStore";

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
      useUserStore.getState().setUser(data); // сохраняем юзера в Zustand
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

      // Сохраняем токены в cookie
      Cookies.set("accessToken", data.access, { expires: 1 });
      Cookies.set("refreshToken", data.refresh, { expires: 7 });

      // Получаем профиль и сохраняем в Zustand
      await fetchProfile(data.access);

      // Редирект на главную
      router.push("/");
    } else {
      const error = await res.json();
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md bg-background">
      <h1 className="text-2xl font-bold mb-6">Вход</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            name="email"
          />
        </div>
        <div className="mb-6 relative">
          <Label htmlFor="password">Пароль</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-5 right-2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Button type="submit">Войти</Button>
      </form>
    </div>
  );
}
