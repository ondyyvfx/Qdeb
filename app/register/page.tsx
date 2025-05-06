"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useUserStore } from "@/stores/useUserStore";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [full_name, setFull_name] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
      setAvatarError(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const re =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.{8,})(?!.*[^a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/;
    return re.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Введите корректный email.");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Пароль должен быть не менее 8 символов, содержать заглавную латинскую букву и спецсимвол."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают.");
      return;
    }

    if (!avatar) {
      setAvatarError(true);
      toast.error("Пожалуйста, загрузите аватар.");
      return;
    } else {
      setAvatarError(false);
    }

    if (!phone) {
      setPhoneError(true);
      toast.error("Пожалуйста, введите номер телефона.");
      return;
    } else {
      setPhoneError(false);
    }

    setIsLoading(true);

    try {
      // Получение CSRF токена
      const getCsrfToken = async () => {
        const res = await fetch("https://qdeb.kz/api/csrf/", {
          credentials: "include",
        });
        const data = await res.json();
        return data.csrfToken;
      };

      const csrfToken = await getCsrfToken();

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("full_name", full_name);
      formData.append("phone", phone);
      if (avatar) {
        formData.append("avatar", avatar);
      } else {
        formData.append("avatar", "");
      }

      // Регистрация
      const registerRes = await fetch("https://qdeb.kz/api/auth/register/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: formData,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        const errorMessage =
          errorData?.email?.[0] ||
          errorData?.password?.[0] ||
          errorData?.detail ||
          "Ошибка регистрации";
        toast.error(errorMessage);
        return;
      }

      toast.success("Регистрация успешна!");

      // Логин
      const loginRes = await fetch("https://qdeb.kz/api/auth/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        toast.error(
          "Регистрация прошла, но вход не выполнен. Войдите вручную."
        );
        router.push("/login");
        return;
      }

      const loginData = await loginRes.json();
      Cookies.set("accessToken", loginData.access, { expires: 1 });
      Cookies.set("refreshToken", loginData.refresh, { expires: 7 });

      // Получение профиля
      const profileRes = await fetch("https://qdeb.kz/api/auth/profile/", {
        headers: {
          Authorization: `Bearer ${loginData.access}`,
        },
      });

      if (!profileRes.ok) {
        toast.error("Не удалось получить профиль.");
        return;
      }

      const profile = await profileRes.json();
      useUserStore.getState().setUser(profile);

      toast.success("Добро пожаловать!");
      router.push("/");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      toast.error("Ошибка при подключении к серверу.");
    }
  };

  return (
    <div className="register-form flex h-screen bg-[#070A12] text-foreground selection:text-accent">
      <Toaster position="top-center" />
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

      <div className="flex w-full md:w-1/2 items-center justify-center p-8 animate-fade-in">
        <Link href="/">
          <X className="absolute right-[12%] top-[7%] w-5 h-5 text-white" />
        </Link>
        <div className="w-full max-w-md p-10 rounded-3xl shadow-lg bg-muted">
          <h1 className="text-2xl font-bold text-center mb-7">Регистрация</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={full_name}
                onChange={(e) => setFull_name(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="example@gmail.com"
                required
              />
              {emailTouched && !validateEmail(email) && (
                <p className="text-red-500 text-sm mt-1">
                  Пожалуйста, введите корректный email (например,
                  example@gmail.com)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                placeholder="Password"
                required
              />
              {passwordTouched && !validatePassword(password) && (
                <p className="text-red-500 text-sm mt-1">
                  Пароль должен быть не менее 8 символов, заглавную букву и
                  спецсимвол
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Подтвердите пароль</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmPasswordTouched(true)}
                placeholder="Confirm Password"
                required
              />
              {confirmPasswordTouched && password !== confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Пароли не совпадают</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+77471234567 <- без пробелов"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Пожалуйста, введите номер.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Profile picture</Label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm text-white shadow-sm hover:bg-primary/90 transition">
                  Выбрать файл
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-25 w-25 rounded-full object-cover border"
                  />
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-accent hover:bg-accent/90 text-white font-semibold flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Зарегистрироваться"
              )}
            </Button>
            {avatarError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Пожалуйста, загрузите аватар.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
