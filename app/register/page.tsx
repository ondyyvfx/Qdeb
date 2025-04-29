"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFull_name] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const getCsrfToken = async () => {
      const res = await fetch("http://localhost:8000/api/csrf/", {
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
    }

    const res = await fetch("http://localhost:8000/api/auth/register/", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    });

    if (res.ok) {
      alert("Регистрация прошла успешно!");
      router.push("/");
    } else {
      const error = await res.json();
      alert("Ошибка: " + (error?.detail || "неизвестная ошибка"));
    }
  };

  return (
    <div className="register-form flex h-screen bg-[#070A12] text-foreground">
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
        <div className="w-full max-w-md p-10 rounded-3xl shadow-lg bg-muted">
          <h1 className="text-2xl font-bold text-center mb-8">Регистрация</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={full_name}
                onChange={(e) => setFull_name(e.target.value)}
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
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
              className="w-full h-12 rounded-lg bg-accent hover:bg-accent/90 text-white font-semibold"
            >
              Зарегистрироваться
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
