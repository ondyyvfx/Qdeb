"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, DollarSign, Users, FileText, Upload, Save } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AdminOnlyPage from "@/components/shared/AdminOnlyPage";

type RegistrationFieldType = "TEXT" | "DESCRIPTION";

type RegistrationField = {
  name: string;
  type: RegistrationFieldType;
  required: boolean;
};

interface TournamentFormData {
  name: string;
  shortName: string;
  slug: string;
  organizerName: string;
  organizerContact: string;
  description: string;
  eventDate: string;
  active: boolean;
  fee: number;
  level: "LOCAL" | "REGIONAL" | "NATIONAL" | "INTERNATIONAL";
  format: string;
  photo: File | null;
}

const STORAGE_KEY = "tournamentRegistrationTemplate";

const REGISTRATION_TYPE_LABELS: Record<RegistrationFieldType, string> = {
  TEXT: "Короткий ответ",
  DESCRIPTION: "Развернутый ответ",
};

const DEFAULT_REGISTRATION_FIELDS: RegistrationField[] = [
  { name: "Full Name", type: "TEXT", required: true },
  { name: "Institution", type: "TEXT", required: true },
];

const readTemplateFromStorage = (): RegistrationField[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const sanitized = parsed
      .map((item: any) => ({
        name: typeof item?.name === "string" ? item.name.trim() : "",
        type: item?.type === "DESCRIPTION" ? "DESCRIPTION" : "TEXT",
        required: Boolean(item?.required),
      }))
      .filter((item: RegistrationField) => item.name.length > 0);
    return sanitized.length > 0 ? sanitized : null;
  } catch (error) {
    console.error("Failed to read registration template:", error);
    return null;
  }
};

const CreateTournamentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    shortName: "",
    slug: "",
    organizerName: "",
    organizerContact: "",
    description: "",
    eventDate: "",
    active: true,
    fee: 0,
    level: "LOCAL",
    format: "",
    photo: null,
  });
  const [registrationFields, setRegistrationFields] = useState<
    RegistrationField[]
  >(DEFAULT_REGISTRATION_FIELDS);

  useEffect(() => {
    const saved = readTemplateFromStorage();
    if (saved) {
      setRegistrationFields(saved);
    }
  }, []);

  const handleInputChange = (
    field: keyof TournamentFormData,
    value: string | number | boolean | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenFormBuilder = () => {
    router.push("/tournaments/form-builder");
  };

  const handleRefreshRegistrationFields = () => {
    const saved = readTemplateFromStorage();
    if (saved) {
      setRegistrationFields(saved);
      toast.success("Шаблон формы обновлён.");
    } else {
      setRegistrationFields(DEFAULT_REGISTRATION_FIELDS);
      toast.info(
        "Сохранённый шаблон не найден. Откройте конструктор, чтобы создать его."
      );
    }
  };

  const generateSlug = (value: string) => {
    const transliterationMap: Record<string, string> = {
      а: "a",
      б: "b",
      в: "v",
      г: "g",
      д: "d",
      е: "e",
      ё: "e",
      ж: "zh",
      з: "z",
      и: "i",
      й: "y",
      к: "k",
      л: "l",
      м: "m",
      н: "n",
      о: "o",
      п: "p",
      р: "r",
      с: "s",
      т: "t",
      у: "u",
      ф: "f",
      х: "h",
      ц: "ts",
      ч: "ch",
      ш: "sh",
      щ: "shch",
      ъ: "",
      ы: "y",
      ь: "",
      э: "e",
      ю: "yu",
      я: "ya",
    };

    const normalized = value
      .toLowerCase()
      .split("")
      .map((char) => transliterationMap[char] ?? char)
      .join("")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    return normalized || `tournament-${Date.now()}`;
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

    setLoading(true);

    try {
      const preparedRegistrationFields = registrationFields
        .map((field) => ({
          ...field,
          name: field.name.trim(),
        }))
        .filter((field) => field.name.length > 0);

      const formDataToSend = new FormData();
      const normalizedSlug = generateSlug(
        formData.slug || formData.name || `tournament-${Date.now()}`
      );

      const tournamentData = {
        name: formData.name,
        shortName: formData.shortName || formData.name.substring(0, 25),
        slug: normalizedSlug,
        organizerName: formData.organizerName,
        organizerContact: formData.organizerContact,
        description: formData.description,
        date: formData.eventDate,
        active: formData.active,
        fee: formData.fee,
        level: formData.level,
        format: formData.format,
        seq: 1,
        registrationFields:
          preparedRegistrationFields.length > 0
            ? preparedRegistrationFields
            : DEFAULT_REGISTRATION_FIELDS,
      };

      formDataToSend.append("tournament", JSON.stringify(tournamentData));

      if (formData.photo) {
        formDataToSend.append("tournamentPicture", formData.photo);
      }

      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4232/api";

      const token =
        typeof document !== "undefined"
          ? document.cookie
              .split("; ")
              .find((row) => row.startsWith("accessToken="))
              ?.split("=")[1] ?? ""
          : "";

      const response = await fetch(`${apiBase}/tournaments`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        let createdSlug = normalizedSlug;

        try {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const createdData = await response.json();
            if (createdData?.slug) {
              createdSlug = createdData.slug;
            } else if (createdData?.id) {
              createdSlug = String(createdData.id);
            }
          }
        } catch (parseSuccessError) {
          console.warn(
            "Failed to parse tournament creation response:",
            parseSuccessError
          );
        }

        toast.success("Tournament created!");
        router.push(`/tournaments/${createdSlug}`);
      } else {
        let errorMessage = "Failed to create tournament";
        try {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("Server error response:", errorData);

            if (errorData?.message) {
              errorMessage = errorData.message;
            } else if (errorData?.error) {
              errorMessage = errorData.error;
            } else if (typeof errorData === "string") {
              errorMessage = errorData;
            }
          } else {
            const textBody = await response.text();
            if (textBody) {
              errorMessage = textBody;
            } else {
              errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        toast.error(`Failed to create tournament: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast.error("Unexpected error while creating tournament.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminOnlyPage
      title="Недостаточно прав"
      message="Только администраторы могут создавать турниры"
    >
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
                  Заполните форму ниже для публикации нового турнира
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
                        onChange={(e) =>
                          handleInputChange("shortName", e.target.value)
                        }
                        placeholder="QSC2024"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="slug">URL-адрес (slug) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      placeholder="qdeb-spring-championship-2024"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organizerName">
                        Название организации *
                      </Label>
                      <Input
                        id="organizerName"
                        value={formData.organizerName}
                        onChange={(e) =>
                          handleInputChange("organizerName", e.target.value)
                        }
                        placeholder="QDeb Organization"
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
                  </div>

                  <div>
                    <Label htmlFor="description">Описание турнира</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Добавьте краткое описание, особенности, формат..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Даты и формат */}
              <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-accent" />
                    Даты и формат
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
                        onChange={(e) =>
                          handleInputChange("eventDate", e.target.value)
                        }
                        required
                      />
                    </div>
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
                        <option value="INTERNATIONAL">
                          Международный
                        </option>
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

              {/* Форма регистрации для команд */}
              <Card className="bg-white/5 border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-accent" />
                    Форма регистрации
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Настройте поля, которые заполнят команды при подаче заявки.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {registrationFields.length === 0 ? (
                    <p className="text-sm text-gray-300">
                      Поля формы пока не выбраны. Откройте конструктор, чтобы
                      создать шаблон.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {registrationFields.map((field, index) => (
                        <div
                          key={`summary-field-${index}`}
                          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                        >
                          <div className="flex items-center justify-between text-sm text-white font-medium">
                            <span>
                              {index + 1}. {field.name}
                            </span>
                            <span className="text-xs text-gray-300">
                              {REGISTRATION_TYPE_LABELS[field.type]}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-400">
                            {field.required
                              ? "Обязательное поле"
                              : "Необязательное поле"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">
                      Шаблон хранится в браузере. После создания турнира поля
                      будут включены в заявку.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleOpenFormBuilder}
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Открыть конструктор
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleRefreshRegistrationFields}
                      >
                        Обновить
                      </Button>
                    </div>
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
                    <Label htmlFor="organizerName">
                      Название организации *
                    </Label>
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
                      onChange={(e) =>
                        handleInputChange("photo", e.target.files?.[0] || null)
                      }
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
                  className="px-8 py-3 text-lg border-white/20 text-white hover:bg-white/10 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 text-lg bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-xl cursor-pointer gradient-button"
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
    </AdminOnlyPage>
  );
};

export default CreateTournamentPage;
