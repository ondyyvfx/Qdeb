"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, DollarSign, Users, FileText, Upload, Save, ArrowLeft } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
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

const EditTournamentPage = () => {
  const params = useParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api";
  const tournamentId = params.id as string;

  useEffect(() => {
    if (tournamentId) {
      fetchTournament();
    }
  }, [tournamentId]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tournaments/getAll`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tournamentData = Array.isArray(data) ? data.find((t: any) => t.id.toString() === tournamentId) : null;

      if (tournamentData) {
        setFormData({
          name: tournamentData.name || "",
          shortName: tournamentData.shortName || "",
          slug: tournamentData.slug || "",
          organizerName: tournamentData.organizerName || "",
          organizerContacts: tournamentData.organizerContacts || "",
          description: tournamentData.description || "",
          eventDate: tournamentData.eventDate || "",
          active: tournamentData.active || false,
          fee: tournamentData.fee || 0,
          level: tournamentData.level || "SCHOOL",
          format: tournamentData.format || "",
          photo: null,
        });
      } else {
        setError("Турнир не найден");
      }
    } catch (error) {
      console.error("Error fetching tournament:", error);
      setError("Ошибка загрузки турнира");
    } finally {
      setLoading(false);
    }
  };

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
    
    setSaving(true);
    
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

      // Здесь должен быть API вызов для обновления турнира
      // const response = await fetch(`${API_URL}/tournaments/${tournamentId}`, {
      //   method: 'PUT',
      //   body: formDataToSend,
      //   headers: {
      //     'Authorization': `Bearer ${document.cookie.split('accessToken=')[1]?.split(';')[0] || ''}`
      //   }
      // });

      // if (response.ok) {
        toast.success("Турнир успешно обновлен!");
        router.push(`/tournaments/${tournamentId}`);
      // } else {
      //   const errorData = await response.json();
      //   toast.error(`Ошибка обновления турнира: ${errorData.message || 'Неизвестная ошибка'}`);
      // }
    } catch (error) {
      console.error("Error updating tournament:", error);
      toast.error("Произошла ошибка при обновлении турнира");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-lg">Загрузка турнира...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Ошибка</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/tournaments")} className="w-full">
                  Вернуться к турнирам
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Навигация */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push(`/tournaments/${tournamentId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к турниру
            </Button>
          </div>

          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-white/10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Редактирование турнира
              </h1>
              <p className="text-lg text-gray-400 font-medium">
                Измените информацию о турнире
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Основная информация */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Изображение турнира
                </CardTitle>
                <CardDescription>
                  Загрузите новое изображение для турнира (опционально)
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
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/tournaments/${tournamentId}`)}
                disabled={saving}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditTournamentPage;
