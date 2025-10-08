"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, DollarSign, Users, FileText, Upload, Save } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface TournamentFormData {
  name: string;
  shortName: string;
  slug: string;
  organizerName: string;
  organizerContacts: string;
  description: string;
  eventDate: string;
  active: boolean;
  fee: number;
  level: string;
  format: string;
  photo: File | null;
}

const CreateTournamentPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    shortName: "",
    slug: "",
    organizerName: "",
    organizerContacts: "",
    description: "",
    eventDate: "",
    active: true,
    fee: 0,
    level: "SCHOOL",
    format: "",
    photo: null,
  });

  // Пока что разрешаем всем создавать турниры
  const isOrganizer = true;

  const handleInputChange = (field: keyof TournamentFormData, value: string | number | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Пока что разрешаем всем создавать турниры
    // if (!isOrganizer) {
    //   toast.error("Только организаторы могут создавать турниры");
    //   return;
    // }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Создаем объект турнира
      const tournamentData = {
        name: formData.name,
        shortName: formData.shortName || formData.name.substring(0, 25),
        slug: formData.slug,
        organizerName: formData.organizerName,
        organizerContacts: formData.organizerContacts,
        description: formData.description,
        eventDate: formData.eventDate,
        active: formData.active,
        fee: formData.fee,
        level: formData.level,
        format: formData.format,
        seq: 1
      };

      formDataToSend.append('tournament', JSON.stringify(tournamentData));
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api"}/tournaments`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${document.cookie.split('accessToken=')[1]?.split(';')[0] || ''}`
        }
      });

      if (response.ok) {
        toast.success("Турнир успешно создан!");
        router.push("/tournaments");
      } else {
        const errorData = await response.json();
        toast.error(`Ошибка создания турнира: ${errorData.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast.error("Произошла ошибка при создании турнира");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Требуется авторизация</CardTitle>
            <CardDescription>
              Для создания турниров необходимо войти в систему
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} className="w-full">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Пока что разрешаем всем создавать турниры
  // if (!isOrganizer) {
  //   return (
  //     <div className="min-h-screen bg-background text-text flex items-center justify-center">
  //       <Card className="w-full max-w-md">
  //         <CardHeader>
  //           <CardTitle>Доступ ограничен</CardTitle>
  //           <CardDescription>
  //             Только организаторы могут создавать турниры. Обратитесь к администратору для получения роли организатора.
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Button onClick={() => router.push("/tournaments")} variant="outline" className="w-full">
  //             Вернуться к турнирам
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-white/10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Создание турнира
              </h1>
              <p className="text-lg text-gray-400 font-medium">
                Заполните форму для создания нового турнира
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Основная информация */}
            <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-accent" />
                  Основная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Название турнира *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="QDeb Spring Championship 2024"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shortName">Краткое название</Label>
                    <Input
                      id="shortName"
                      value={formData.shortName}
                      onChange={(e) => handleInputChange("shortName", e.target.value)}
                      placeholder="QSC2024"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="slug">URL-адрес (slug) *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="qdeb-spring-championship-2024"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Описание турнира</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Подробное описание турнира, правила, условия участия..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Информация о мероприятии */}
            <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-accent" />
                  Информация о мероприятии
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Дата проведения *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange("eventDate", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fee">Стоимость участия (тенге)</Label>
                    <Input
                      id="fee"
                      type="number"
                      value={formData.fee}
                      onChange={(e) => handleInputChange("fee", Number(e.target.value))}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Уровень турнира</Label>
                    <select
                      id="level"
                      value={formData.level}
                      onChange={(e) => handleInputChange("level", e.target.value)}
                      className="w-full p-2 rounded-md border bg-background text-text"
                      aria-label="Уровень турнира"
                    >
                      <option value="SCHOOL">Школьный</option>
                      <option value="UNIVERSITY">Университетский</option>
                      <option value="NATIONAL">Национальный</option>
                      <option value="INTERNATIONAL">Международный</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="format">Формат дебатов</Label>
                    <Input
                      id="format"
                      value={formData.format}
                      onChange={(e) => handleInputChange("format", e.target.value)}
                      placeholder="British Parliamentary"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => handleInputChange("active", e.target.checked)}
                    className="rounded"
                    aria-label="Регистрация открыта"
                  />
                  <Label htmlFor="active">Регистрация открыта</Label>
                </div>
              </CardContent>
            </Card>

            {/* Информация об организаторе */}
            <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-accent" />
                  Информация об организаторе
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="organizerName">Название организации *</Label>
                  <Input
                    id="organizerName"
                    value={formData.organizerName}
                    onChange={(e) => handleInputChange("organizerName", e.target.value)}
                    placeholder="QDeb Kazakhstan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="organizerContacts">Контактная информация</Label>
                  <Input
                    id="organizerContacts"
                    value={formData.organizerContacts}
                    onChange={(e) => handleInputChange("organizerContacts", e.target.value)}
                    placeholder="contact@qdeb.kz"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Загрузка изображения */}
            <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <Upload className="w-6 h-6 text-accent" />
                  Изображение турнира
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Загрузите изображение для турнира (опционально)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="photo">Выберите изображение</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange("photo", e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Кнопки действий */}
            <div className="flex gap-4 justify-end pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/tournaments")}
                disabled={loading}
                className="px-8 py-3 text-lg border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 text-lg bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Save className="w-5 h-5" />
                {loading ? "Создание..." : "Создать турнир"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateTournamentPage;
