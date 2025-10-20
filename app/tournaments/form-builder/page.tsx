"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AdminOnlyPage from "@/components/shared/AdminOnlyPage";
import {
  FileText,
  Plus,
  Save,
  Trash2,
  Undo,
  ArrowLeft,
} from "lucide-react";

type RegistrationFieldType = "TEXT" | "DESCRIPTION";

type RegistrationField = {
  name: string;
  type: RegistrationFieldType;
  required: boolean;
};

const STORAGE_KEY = "tournamentRegistrationTemplate";

const TYPE_OPTIONS: { value: RegistrationFieldType; label: string }[] = [
  { value: "TEXT", label: "Short answer" },
  { value: "DESCRIPTION", label: "Paragraph" },
];

const TYPE_DESCRIPTIONS: Record<RegistrationFieldType, string> = {
  TEXT: "Краткий ответ (одно короткое поле ввода)",
  DESCRIPTION: "Развернутый ответ (многострочное поле)",
};

const DEFAULT_TEMPLATE: RegistrationField[] = [
  { name: "Full Name", type: "TEXT", required: true },
  { name: "Institution", type: "TEXT", required: true },
];

const loadTemplate = (): RegistrationField[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return null;
    const normalized = parsed
      .map((item: any) => ({
        name: typeof item?.name === "string" ? item.name.trim() : "",
        type: item?.type === "DESCRIPTION" ? "DESCRIPTION" : "TEXT",
        required: Boolean(item?.required),
      }))
      .filter((item: RegistrationField) => item.name.length > 0);
    return normalized.length > 0 ? normalized : null;
  } catch (error) {
    console.error("Failed to read stored registration template:", error);
    return null;
  }
};

const saveTemplate = (fields: RegistrationField[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
};

export default function TournamentFormBuilderPage() {
  const router = useRouter();
  const [fields, setFields] = useState<RegistrationField[]>(DEFAULT_TEMPLATE);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = loadTemplate();
    if (saved) {
      setFields(saved);
    }
  }, []);

  const handleFieldChange = (
    index: number,
    field: keyof RegistrationField,
    value: string | boolean
  ) => {
    setFields((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "required"
                  ? Boolean(value)
                  : (value as RegistrationFieldType | string),
            }
          : item
      )
    );
  };

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      { name: "", type: "TEXT", required: false },
    ]);
  };

  const handleRemoveField = (index: number) => {
    setFields((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)
    );
  };

  const handleResetTemplate = () => {
    setFields(DEFAULT_TEMPLATE);
    toast.success("Шаблон сброшен к стандартным полям.");
  };

  const handleSaveTemplate = () => {
    const sanitized = fields
      .map((field) => ({
        ...field,
        name: field.name.trim(),
      }))
      .filter((field) => field.name.length > 0);

    if (sanitized.length === 0) {
      toast.error("Добавьте хотя бы одно поле и заполните его название.");
      return;
    }

    setSaving(true);
    try {
      saveTemplate(sanitized);
      setFields(sanitized);
      toast.success("Шаблон формы сохранён. Теперь его можно использовать при создании турнира.");
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Не удалось сохранить шаблон. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  const handleBackToCreate = () => {
    router.push("/tournaments/create");
  };

  return (
    <AdminOnlyPage
      title="Конструктор формы регистрации"
      message="Страница доступна только организаторам"
    >
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-white flex items-center gap-3">
                  <FileText className="w-8 h-8 text-accent" />
                  Конструктор формы регистрации
                </h1>
                <p className="mt-2 text-gray-400 text-sm md:text-base max-w-2xl">
                  Создайте набор полей, которые команды будут заполнять при подаче заявки на турнир.
                  Сохранённый шаблон автоматически подставится на странице создания турнира.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleBackToCreate}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  К созданию турнира
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetTemplate}
                  className="flex items-center gap-2"
                >
                  <Undo className="w-4 h-4" />
                  Сбросить
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Сохранение..." : "Сохранить шаблон"}
                </Button>
              </div>
            </div>

            <Card className="bg-white/5 border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Поля формы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={`builder-field-${index}`}
                      className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4">
                        <div>
                          <Label className="text-sm text-gray-300">
                            Название поля
                          </Label>
                          <Input
                            value={field.name}
                            onChange={(e) =>
                              handleFieldChange(index, "name", e.target.value)
                            }
                            placeholder="Например, Имя участника"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-300">
                            Тип поля
                          </Label>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "type",
                                e.target.value as RegistrationFieldType
                              )
                            }
                            className="w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                          >
                            {TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-gray-400">
                            {TYPE_DESCRIPTIONS[field.type]}
                          </p>
                        </div>
                        <div className="flex items-end justify-end gap-3">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`required-${index}`}
                              checked={field.required}
                              onCheckedChange={(checked) =>
                                handleFieldChange(
                                  index,
                                  "required",
                                  Boolean(checked)
                                )
                              }
                            />
                            <Label
                              htmlFor={`required-${index}`}
                              className="text-sm text-gray-300"
                            >
                              Обязательное
                            </Label>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleRemoveField(index)}
                            disabled={fields.length === 1}
                            className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddField}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Добавить поле
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </AdminOnlyPage>
  );
}
