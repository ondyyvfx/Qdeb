"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");

//     Email
// Password
// Full name

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const res = await fetch("http://localhost:8000/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        fullname,
        phone
      }),
    });
  
    if (res.ok) {
      const data = await res.json();
      console.log("Успешная регистрация:", data);
      // Здесь можно редиректнуть на login или показать сообщение
    } else {
      const error = await res.json();
      console.error("Ошибка:", error);
      // Покажи ошибку на UI (например, через useState)
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md bg-background">
      <h1 className="text-2xl font-bold mb-6">Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="first_name">Full name</Label>
          <Input value={fullname} onChange={(e) => setFullname(e.target.value)} id="first_name" name="first_name" />
        </div>
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" />
        </div>
        <div className="mb-6">
          <Label htmlFor="password">Пароль</Label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" />
        </div>
        <div className="mb-6">
          <Label htmlFor="password">Phone number</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="phone" name="phone" />
        </div>
        <Button type="submit">Зарегистрироваться</Button>
      </form>
    </div>
  );
}
