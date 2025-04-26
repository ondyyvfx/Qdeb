"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";
import Image from "next/image";
import Qlogo from "@/public/assets/Q.svg";

const EditProfileForm = () => {
  const user = useUserStore((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    description: "",
    avatar: "",
    elo_rating: 0,
    tournaments_completed: 0,
    avg_speech: 0,
    std_deviation: 0,
    total_achievements: 0,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        full_name: user.full_name || "",
        phone: user.phone || "",
        description: user.description || "",
        avatar: user.avatar || "",
        elo_rating: user.elo_rating || 0,
        tournaments_completed: user.tournaments_completed || 0,
        avg_speech: user.avg_speech || 0,
        std_deviation: user.std_deviation || 0,
        total_achievements: user.total_achievements || 0,
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("rating") ||
        name.includes("completed") ||
        name.includes("avg") ||
        name.includes("deviation") ||
        name.includes("total")
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Токен не найден");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Ошибка обновления профиля");

      toast.success("Профиль успешно обновлен!");
    } catch (error) {
      toast.error("Ошибка при обновлении профиля");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-background shadow-xl rounded-2xl mt-6">
      <div className="flex items-center gap-4">
        {user?.avatar ? (
          <div className="w-24 h-24 relative rounded-full overflow-hidden border border-gray-300">
            <Image
              src={user.avatar}
              alt="User avatar"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">
            {user?.full_name || "Имя пользователя"}
          </h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Личная информация</h2>
          <div className="space-y-3">
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Полное имя"
              required
            />
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Телефон"
              required
            />
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="О себе"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Статистика</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Elo рейтинг</p>
              <Input
                type="number"
                name="elo_rating"
                value={formData.elo_rating}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Турниров завершено
              </p>
              <Input
                type="number"
                name="tournaments_completed"
                value={formData.tournaments_completed}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Средний спикерский балл
              </p>
              <Input
                type="number"
                step="0.1"
                name="avg_speech"
                value={formData.avg_speech}
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Станд. отклонение
              </p>
              <Input
                type="number"
                step="0.1"
                name="std_deviation"
                value={formData.std_deviation}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground mb-1">
                Достижений всего
              </p>
              <Input
                type="number"
                name="total_achievements"
                value={formData.total_achievements}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Сохранить
        </Button>
      </form>
    </div>
  );
};

export default EditProfileForm;
