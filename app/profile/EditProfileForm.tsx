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
    avatar: null as File | null, // Изменено на File
    elo_rating: "",
    tournaments_completed: "",
    avg_speech: "",
    std_deviation: "",
    total_achievements: "",
  });

  const [achievementData, setAchievementData] = useState({
    title: "",
    tournament_id: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        full_name: user.full_name || "",
        phone: user.phone || "",
        description: user.description || "",
        avatar: user.avatar ? null : null, // Если есть аватар, то оставляем null
        elo_rating: user.elo_rating?.toString() || "",
        tournaments_completed: user.tournaments_completed?.toString() || "",
        avg_speech: user.avg_speech?.toString() || "",
        std_deviation: user.std_deviation?.toString() || "",
        total_achievements: user.total_achievements?.toString() || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  const handleAchievementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAchievementData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Токен не найден");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("full_name", formData.full_name);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("description", formData.description);
    formDataToSend.append(
      "elo_rating",
      formData.elo_rating ? formData.elo_rating : ""
    );
    formDataToSend.append(
      "tournaments_completed",
      formData.tournaments_completed ? formData.tournaments_completed : ""
    );
    formDataToSend.append(
      "avg_speech",
      formData.avg_speech ? formData.avg_speech : ""
    );
    formDataToSend.append(
      "std_deviation",
      formData.std_deviation ? formData.std_deviation : ""
    );
    formDataToSend.append(
      "total_achievements",
      formData.total_achievements ? formData.total_achievements : ""
    );

    // Добавляем аватар, если выбран файл
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend, // Отправляем FormData, не JSON
      });

      if (!res.ok) throw new Error("Ошибка обновления профиля");

      toast.success("Профиль успешно обновлен!");
    } catch (error) {
      toast.error("Ошибка при обновлении профиля");
    }
  };

  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Токен не найден");
      return;
    }

    try {
      const payload = {
        title: achievementData.title,
        tournament_id: achievementData.tournament_id
          ? Number(achievementData.tournament_id)
          : null,
      };

      const res = await fetch(
        "http://localhost:8000/api/auth/add_achievement/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Ошибка добавления достижения");

      toast.success("Достижение добавлено!");

      setAchievementData({
        title: "",
        tournament_id: "",
      });
    } catch (error) {
      toast.error("Ошибка при добавлении достижения");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-background shadow-xl rounded-2xl mt-6">
      <div className="flex items-center justify-between gap-6 mb-8">
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
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-semibold">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-grow">
          <h1 className="text-3xl font-semibold text-gray-800">
            {user?.full_name || "Имя пользователя"}
          </h1>
          <p className="text-lg text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-4 text-gray-800">
            Личная информация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Полное имя</p>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Полное имя"
                required
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Телефон</p>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Телефон"
                required
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">О себе</p>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="О себе"
                rows={4}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Аватар</p>
              <input
                type="file"
                name="avatar"
                onChange={handleAvatarChange}
                accept="image/*"
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">ELO рейтинг</p>
              <Input
                name="elo_rating"
                value={formData.elo_rating}
                onChange={handleChange}
                placeholder="ELO рейтинг"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">
                Завершенные турниры
              </p>
              <Input
                name="tournaments_completed"
                value={formData.tournaments_completed}
                onChange={handleChange}
                placeholder="Завершенные турниры"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">
                Средний балл за спич
              </p>
              <Input
                name="avg_speech"
                value={formData.avg_speech}
                onChange={handleChange}
                placeholder="Средний балл"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">
                Стандартное отклонение
              </p>
              <Input
                name="std_deviation"
                value={formData.std_deviation}
                onChange={handleChange}
                placeholder="Стандартное отклонение"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">
                Общее количество достижений
              </p>
              <Input
                name="total_achievements"
                value={formData.total_achievements}
                onChange={handleChange}
                placeholder="Общее количество достижений"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-white hover:bg-primary-dark transition duration-200"
        >
          Сохранить изменения
        </Button>
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-medium mb-6 text-gray-800">
          Добавить достижение
        </h2>
        <form onSubmit={handleAddAchievement} className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Название достижения
            </p>
            <Input
              name="title"
              value={achievementData.title}
              onChange={handleAchievementChange}
              placeholder="Введите название"
              required
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              ID турнира (опционально)
            </p>
            <Input
              name="tournament_id"
              value={achievementData.tournament_id}
              onChange={handleAchievementChange}
              placeholder="Введите ID турнира"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary-dark transition duration-200"
          >
            Добавить достижение
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
