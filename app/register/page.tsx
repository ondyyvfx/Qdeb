"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
// import Cookies from "js-cookie";
// import { useUserStore } from "@/stores/useUserStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

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
  const [isAgreedWithPolicy, setIsAgreedWithPolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // profilePicture is optional per backend docs
  const [phoneError] = useState(false);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "O">("O");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setAvatar(null);
      setPreview(null);
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

  const validatePhone = (phone: string) => /^\+7\d{10}$/.test(phone);
  const validateFullName = (name: string) =>
    name.trim().split(/\s+/).length >= 2;

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

    if (!validateFullName(full_name)) {
      toast.error("Полное имя должно состоять минимум из двух слов.");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Телефон должен быть в формате +7XXXXXXXXXX.");
      return;
    }

    // avatar is optional

    setIsLoading(true);

    try {
      const formData = new FormData();

      const json = JSON.stringify({
        username,
        email,
        password,
        fullName: full_name,
        gender,
        phone,
        description: "Hello!",
      });

      // send as plain string; browser sets multipart boundary automatically
      formData.append("register", json);

      if (avatar) {
        formData.append("profilePicture", avatar);
      }

      // no debug logs in production

      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        // Попробуем разобрать JSON с ошибками валидации
        let message = "Ошибка регистрации";
        try {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const errorData: unknown = await res.json();
            const asRecord = (val: unknown): Record<string, unknown> | null =>
              val && typeof val === "object"
                ? (val as Record<string, unknown>)
                : null;
            const errObj = asRecord(errorData);
            if (errObj && errObj.errors && typeof errObj.errors === "object") {
              const details = Object.entries(
                errObj.errors as Record<string, unknown>
              )
                .map(([field, msg]) => `${String(field)}: ${String(msg)}`)
                .join("; ");
              message = details || message;
            } else if (errObj && errObj.error) {
              message = String(errObj.error);
            } else if (errObj && errObj.message) {
              message = String(errObj.message);
            }
          } else {
            const text = await res.text();
            if (text) message = text;
          }
        } catch {}
        throw new Error(message);
      }

      toast.success("Регистрация успешна!");
      router.push("/login");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Ошибка при подключении к серверу.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form flex bg-[#070A12] text-foreground selection:text-accent">
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
          <X className="absolute right-[5%] top-[7%] w-5 h-5 text-white" />
        </Link>
        <div className="w-full px-4 rounded-3xl shadow-lg bg-muted">
          <h1 className="text-4xl font-bold text-center mb-7">
            Создайте аккаунт
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-lg">
                Полное имя
              </Label>
              <Input
                id="full_name"
                value={full_name}
                onChange={(e) => setFull_name(e.target.value)}
                placeholder="Имя и Фамилия"
                required
                className="border-gray-700 bg-gray-900 focus-visible:border-accent focus-visible:ring-accent h-[60px] rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg">
                Nickname
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nickname"
                required
                className="border-gray-700 bg-gray-900 focus-visible:border-accent focus-visible:ring-accent h-[60px] rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">
                Электронная почта
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="example@gmail.com"
                required
                className="border-gray-700 bg-gray-900 focus-visible:border-accent focus-visible:ring-accent h-[60px] rounded-xl"
              />
              {emailTouched && !validateEmail(email) && (
                <p className="text-red-500 text-sm mt-1">
                  Пожалуйста, введите корректный email (например,
                  example@gmail.com)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-lg">
                Гендер
              </Label>
              <div className="inline-flex rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setGender("M")}
                  className={`px-4 py-2 text-sm transition-colors ${
                    gender === "M"
                      ? "bg-accent text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  Мужской
                </button>
                <button
                  type="button"
                  onClick={() => setGender("F")}
                  className={`px-4 py-2 text-sm transition-colors ${
                    gender === "F"
                      ? "bg-accent text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  Женский
                </button>
                <button
                  type="button"
                  onClick={() => setGender("O")}
                  className={`px-4 py-2 text-sm transition-colors ${
                    gender === "O"
                      ? "bg-accent text-white"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  Другое
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">
                Пароль
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="Придумайте пароль"
                  required
                  className="border-gray-700 bg-gray-900 focus-visible:border-accent focus-visible:ring-accent h-[60px] rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-300"
                  aria-label={
                    showPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
              {passwordTouched && !validatePassword(password) && (
                <p className="text-red-500 text-sm mt-1">
                  Пароль должен быть не менее 8 символов, заглавную букву и
                  спецсимвол
                </p>
              )}
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setConfirmPasswordTouched(true)}
                  placeholder="Подтвердите пароль"
                  required
                  className="border-gray-700 bg-gray-900 focus-visible:border-accent focus-visible:ring-accent h-[60px] rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-300"
                  aria-label={
                    showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={24} />
                  ) : (
                    <Eye size={24} />
                  )}
                </button>
              </div>
              {confirmPasswordTouched && password !== confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Пароли не совпадают</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg">
                Номер телефона
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+77471234567 <- без пробелов"
                className="border-gray-700 bg-gray-900 focus-visible:border-accent focus-visible:ring-accent h-[60px] rounded-xl"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Пожалуйста, введите номер.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-lg">
                Фото профиля
              </Label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer rounded-lg  bg-accent px-4 py-2 text-sm text-white shadow-sm hover:bg-accent/90 transition">
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
            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember"
                checked={isAgreedWithPolicy}
                onCheckedChange={(checked) => setIsAgreedWithPolicy(!!checked)}
              />
              <Label htmlFor="remember" className="text-md">
                Я согласен(-на) с{" "}
                <a href="/privacy-policy" className="">
                  Условиями пользования
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-accent hover:bg-accent/90 text-white text-lg font-semibold flex items-center justify-center"
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
            <div className="flex justify-center text-base">
              <span className="text-muted-foreground">
                Уже есть аккаунт?&nbsp;
              </span>
              <a
                href="/login"
                className="text-accent hover:underline font-medium"
              >
                Войти в аккаунт
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
