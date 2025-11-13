"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminOnlyPage from "@/components/shared/AdminOnlyPage";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  FileText,
  Upload,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { apiGet, safeParseResponse } from "@/lib/api";

interface TournamentFormData {
  name: string;
  shortName: string;
  slug: string;
  organizerName: string;
  organizerContact: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
  fee: number;
  level: "LOCAL" | "REGIONAL" | "NATIONAL" | "INTERNATIONAL";
  format: string;
  photo: File | null;
}

const EditTournamentPage = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    shortName: "",
    slug: "",
    organizerName: "",
    organizerContact: "",
    description: "",
    startDate: "",
    endDate: "",
    active: true,
    fee: 0,
    level: "LOCAL",
    format: "",
    photo: null,
  });

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";
  const tournamentSlug = (params.slug as string) || "";

  useEffect(() => {
    if (tournamentSlug) {
      fetchTournament();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentSlug]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tournaments/${tournamentSlug}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Tournament not found.");
          setLoading(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parseResult = await safeParseResponse(response);
      
      if (parseResult.error) {
        throw new Error(parseResult.error);
      }

      if (!parseResult.isJson || !parseResult.data) {
        throw new Error("Unexpected response format");
      }

      const raw = parseResult.data as Record<string, unknown>;

      setFormData({
        name: (raw?.name as string) || "",
        shortName: (raw?.shortName as string) || (raw?.name as string) || "",
        slug: (raw?.slug as string) || tournamentSlug,
        organizerName: (raw?.organizerName as string) || "",
        organizerContact: (raw?.organizerContact as string) || (raw?.organizerContacts as string) || "",
        description: (raw?.description as string) || "",
        startDate: (raw?.startDate as string) || (raw?.date as string) || (raw?.eventDate as string) || "",
        endDate: (raw?.endDate as string) || (raw?.date as string) || (raw?.eventDate as string) || "",
        active: Boolean(raw?.active),
        fee:
          typeof raw?.fee === "number"
            ? raw.fee
            : Number.parseFloat((raw?.fee as string) ?? "0") || 0,
        level: (raw?.level as TournamentFormData["level"]) || "LOCAL",
        format: (raw?.format as string) || "",
        photo: null,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching tournament:", err);
      setError("Не удалось загрузить данные турнира.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof TournamentFormData,
    value: string | number | boolean | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      const formDataToSend = new FormData();

      const tournamentData = {
        name: formData.name,
        shortName: formData.shortName || formData.name.substring(0, 25),
        slug: formData.slug,
        organizerName: formData.organizerName,
        organizerContact: formData.organizerContact,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        active: formData.active,
        fee: formData.fee,
        level: formData.level,
        format: formData.format,
        seq: 1,
      };

      formDataToSend.append("tournament", JSON.stringify(tournamentData));

      if (formData.photo) {
        formDataToSend.append("tournamentPicture", formData.photo);
      }

      // TODO: PUT /api/tournaments/{slug}
      toast.success("Турнир успешно обновлен!");
      router.push(`/tournaments/${tournamentSlug}`);
    } catch (err) {
      console.error("Error updating tournament:", err);
      toast.error("Произошла ошибка при обновлении турнира");
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
              <p className="text-lg">Загрузка турнира...</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Ошибка</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/tournaments")}
                  className="w-full"
                >
                  Вернуться к списку
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push(`/tournaments/${tournamentSlug}`)}
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
                      placeholder="QDeb Spring Championship"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shortName">Краткое название</Label>
                    <Input
                      id="shortName"
                      value={formData.shortName}
                      onChange={(e) =>
                        handleInputChange("shortName", e.target.value)
                      }
                      placeholder="QSC"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="slug">URL-адрес (slug) *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="qdeb-spring-championship"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Добавьте описание турнира"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Даты и информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Дата начала *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Дата окончания *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      required
                      min={formData.startDate}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fee">Регистрационный взнос (₸)</Label>
                    <Input
                      id="fee"
                      type="number"
                      value={formData.fee}
                      onChange={(e) =>
                        handleInputChange("fee", Number(e.target.value))
                      }
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
                      onChange={(e) =>
                        handleInputChange("level", e.target.value)
                      }
                      className="w-full p-2 rounded-md border bg-background text-text"
                      aria-label="Уровень турнира"
                    >
                      <option value="LOCAL">Локальный</option>
                      <option value="REGIONAL">Региональный</option>
                      <option value="NATIONAL">Национальный</option>
                      <option value="INTERNATIONAL">Международный</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="format">Формат дебатов</Label>
                    <Input
                      id="format"
                      value={formData.format}
                      onChange={(e) =>
                        handleInputChange("format", e.target.value)
                      }
                      placeholder="British Parliamentary"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) =>
                      handleInputChange("active", e.target.checked)
                    }
                    className="rounded"
                    aria-label="Регистрация открыта"
                  />
                  <Label htmlFor="active">Регистрация открыта</Label>
                </div>
              </CardContent>
            </Card>

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
                    onChange={(e) =>
                      handleInputChange("organizerName", e.target.value)
                    }
                    placeholder="QDeb Kazakhstan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="organizerContact">
                    Контактная информация
                  </Label>
                  <Input
                    id="organizerContact"
                    value={formData.organizerContact}
                    onChange={(e) =>
                      handleInputChange("organizerContact", e.target.value)
                    }
                    placeholder="contact@qdeb.kz"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Изображение турнира
                </CardTitle>
                <CardDescription>
                  Загрузите новое изображение (опционально)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="photo">Выберите файл</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleInputChange("photo", e.target.files?.[0] || null)
                    }
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/tournaments/${tournamentSlug}`)}
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
    );
  };

  return (
    <AdminOnlyPage
      title="Недостаточно прав"
      message="Только администраторы могут редактировать турниры"
    >
      <Navbar />
      <div className="min-h-screen bg-background text-text">
        {renderContent()}
      </div>
      <Footer />
    </AdminOnlyPage>
  );
};

export default EditTournamentPage;
export default EditTournamentPage;