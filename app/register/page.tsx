"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function RegisterPage() {

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
        formData.append("avatar", avatar); // <-- имя должно совпадать с бэкендом
      }
    
      const res = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        credentials: "include",
        headers: {
          'X-CSRFToken': csrfToken,
        },
        body: formData,
      });
    
      if (res.ok) {
        const data = await res.json();
        console.log("Успешная регистрация:", data);
      } else {
        const error = await res.json();
        console.error("Ошибка:", error);
      }
    };
    
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <div className="w-full max-w-lg p-8 border rounded-2xl shadow-md bg-background">
        <h1 className="text-3xl font-bold mb-6 text-center">Регистрация</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="first_name">Full name</Label>
            <Input value={full_name} onChange={(e) => setFull_name(e.target.value)} id="first_name" name="first_name" />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Пароль</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" />
          </div>
          <div className="mb-4">
            <Label htmlFor="phone">Phone number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" name="phone" />
          </div>

          <div className="mb-6">
            <Label htmlFor="pfp">Profile picture</Label>
            <div className="flex items-center gap-4 mt-2">
              <label className="cursor-pointer px-4 py-2 bg-accent text-white rounded-lg shadow-sm hover:bg-primary/90 transition">
                Выбрать файл
                <input
                  onChange={handleFileChange}
                  type="file"
                  accept="image/*"
                  name="profilePicture"
                  className="hidden"
                />
              </label>
              {preview && (
                <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-full border" />
              )}
            </div>
          </div>
            
          <Button type="submit" className="w-full mt-4">Зарегистрироваться</Button>
        </form>
      </div>
    </div>
  );
}
