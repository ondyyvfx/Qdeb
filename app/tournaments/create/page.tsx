"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { Calendar, Users, FileText, Upload, Save } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AdminOnlyPage from "@/components/shared/AdminOnlyPage";
import { safeParseResponse } from "@/lib/api";

type RegistrationFieldType =
  | "TEXT"
  | "DESCRIPTION"
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "linear_scale";

type RegistrationField = {
  id: string;
  name: string;
  title: string;
  description: string;
  type: RegistrationFieldType;
  required: boolean;
  options: string[];
  scale?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
};

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

const STORAGE_KEY = "tournamentRegistrationTemplate";

// Map frontend field types to backend enum values
const mapFieldTypeToBackend = (
  frontendType: RegistrationFieldType
): "DESCRIPTION" | "TEXT" => {
  switch (frontendType) {
    case "TEXT":
    case "short_answer":
      return "TEXT";
    case "DESCRIPTION":
    case "paragraph":
    case "multiple_choice":
    case "checkboxes":
    case "dropdown":
    case "linear_scale":
    default:
      return "DESCRIPTION";
  }
};

const REGISTRATION_TYPE_LABELS: Record<RegistrationFieldType, string> = {
  TEXT: "Короткий ответ",
  DESCRIPTION: "Развернутый ответ",
  short_answer: "Короткий ответ",
  paragraph: "Развернутый ответ",
  multiple_choice: "Один вариант",
  checkboxes: "Несколько вариантов",
  dropdown: "Выпадающий список",
  linear_scale: "Шкала оценки",
};

const DEFAULT_REGISTRATION_FIELDS: RegistrationField[] = [
  {
    id: "field-1",
    name: "Full Name",
    title: "Полное имя",
    description: "",
    type: "TEXT",
    required: true,
    options: [],
  },
  {
    id: "field-2",
    name: "Institution",
    title: "Учебное заведение",
    description: "",
    type: "TEXT",
    required: true,
    options: [],
  },
];

const readTemplateFromStorage = (): RegistrationField[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const sanitized = parsed
      .map((item: unknown) => {
        const field = item as Record<string, unknown>;
        return {
          id: (typeof field?.id === "string"
            ? field.id
            : `field-${Date.now()}`) as string,
          name: typeof field?.name === "string" ? field.name.trim() : "",
          title:
            typeof field?.title === "string"
              ? field.title.trim()
              : typeof field?.name === "string"
              ? field.name
              : "",
          description:
            typeof field?.description === "string"
              ? field.description.trim()
              : "",
          type: (field?.type as RegistrationFieldType) || "TEXT",
          required: Boolean(field?.required),
          options: Array.isArray(field?.options)
            ? (field.options as string[])
            : [],
          scale: (field?.scale as RegistrationField["scale"]) || undefined,
        } as RegistrationField;
      })
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
    startDate: "",
    endDate: "",
    active: true,
    fee: 0,
    level: "LOCAL",
    format: "",
    photo: null,
  });
  const [registrationFields, setRegistrationFields] = useState<
    RegistrationField[]
  >(DEFAULT_REGISTRATION_FIELDS);
  const [isSlugDirty, setIsSlugDirty] = useState(false);

  useEffect(() => {
    const saved = readTemplateFromStorage();
    if (saved) {
      setRegistrationFields(saved);
    }
  }, []);

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

  const recommendedSlug = useMemo(() => {
    return formData.name.trim() ? generateSlug(formData.name) : "";
  }, [formData.name]);

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

  const handleNameChange = (name: string) => {
    setFormData((prev) => {
      const next = { ...prev, name };
      if (!isSlugDirty) {
        next.slug = name.trim() ? generateSlug(name) : "";
      }
      return next;
    });
  };

  const handleSlugChange = (slugValue: string) => {
    const trimmed = slugValue.trim();
    setIsSlugDirty(Boolean(trimmed));
    handleInputChange("slug", slugValue);
  };

  const applyRecommendedSlug = () => {
    if (!recommendedSlug) return;
    setIsSlugDirty(false);
    setFormData((prev) => ({
      ...prev,
      slug: recommendedSlug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const preparedRegistrationFields = registrationFields
        .map((field) => ({
          name: field.name.trim(),
          type: mapFieldTypeToBackend(field.type),
          required: field.required,
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
        startDate: formData.startDate,
        endDate: formData.endDate,
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

        const parseResult = await safeParseResponse(response);

        if (parseResult.error) {
          console.warn(
            "Failed to parse tournament creation response:",
            parseResult.error
          );
        } else if (parseResult.isJson && parseResult.data) {
          const createdData = parseResult.data as Record<string, unknown>;
          if (createdData?.slug && typeof createdData.slug === "string") {
            createdSlug = createdData.slug;
          } else if (createdData?.id) {
            createdSlug = String(createdData.id);
          }
        }

        toast.success("Tournament created!");
        router.push(`/tournaments/${createdSlug}`);
      } else {
        const parseResult = await safeParseResponse(response);

        let errorMessage = "Failed to create tournament";

        if (parseResult.error) {
          errorMessage = parseResult.error;
        } else if (typeof parseResult.data === "string") {
          errorMessage = parseResult.data;
        } else if (parseResult.data && typeof parseResult.data === "object") {
          const data = parseResult.data as Record<string, unknown>;
          errorMessage = (data.message ||
            data.error ||
            data.detail ||
            errorMessage) as string;
        } else {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        console.error("Server error response:", parseResult.data);
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
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="qdeb-spring-championship-2024"
                      required
                    />
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      {recommendedSlug ? (
                        <>
                          <span>
                            Рекомендуемый slug:{" "}
                            <span className="text-white">
                              {recommendedSlug}
                            </span>
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={applyRecommendedSlug}
                            className="h-6 px-2 text-xs"
                          >
                            Использовать
                          </Button>
                        </>
                      ) : (
                        <span>
                          Укажите понятный адрес — он появится в ссылке на
                          турнир.
                        </span>
                      )}
                    </div>
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
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0"
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            handleInputChange("fee", "");
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (/^\d*$/.test(value)) {
                            handleInputChange("fee", value);
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            handleInputChange("fee", "0");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) && // разрешаем только цифры
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault();
                          }
                        }}
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
                        className="w-full p-2 rounded-md border  text-text"
                        aria-label="Уровень турнира"
                      >
                        <option
                          value="LOCAL"
                          className="bg-[#0e1425] text-white"
                        >
                          Локальный
                        </option>
                        <option
                          value="REGIONAL"
                          className="bg-[#0e1425]  text-white"
                        >
                          Региональный
                        </option>
                        <option
                          value="NATIONAL"
                          className="bg-[#0e1425]  text-white"
                        >
                          Национальный
                        </option>
                        <option
                          value="INTERNATIONAL"
                          className="bg-[#0e1425]  text-white"
                        >
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
                              {index + 1}. {field.title || field.name}
                            </span>
                            <span className="text-xs text-gray-300">
                              {REGISTRATION_TYPE_LABELS[field.type]}
                            </span>
                          </div>
                          {field.description && (
                            <p className="mt-1 text-xs text-gray-400">
                              {field.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              {field.required
                                ? "Обязательное поле"
                                : "Необязательное поле"}
                            </p>
                            {(field.type === "multiple_choice" ||
                              field.type === "checkboxes" ||
                              field.type === "dropdown") && (
                              <p className="text-xs text-gray-400">
                                {field.options.length} вариантов
                              </p>
                            )}
                            {field.type === "linear_scale" && field.scale && (
                              <p className="text-xs text-gray-400">
                                Шкала {field.scale.min}-{field.scale.max}
                              </p>
                            )}
                          </div>
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
