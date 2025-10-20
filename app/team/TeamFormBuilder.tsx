"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  CheckSquare,
  Circle,
  Copy,
  Dot,
  MessageSquare,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

type QuestionType =
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "checkboxes"
  | "dropdown"
  | "linear_scale";

type Question = {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  required: boolean;
  options: string[];
  scale?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
};

const generateId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const typeOptions: { value: QuestionType; label: string }[] = [
  { value: "short_answer", label: "Короткий ответ" },
  { value: "paragraph", label: "Развернутый ответ" },
  { value: "multiple_choice", label: "Один вариант" },
  { value: "checkboxes", label: "Несколько вариантов" },
  { value: "dropdown", label: "Выпадающий список" },
  { value: "linear_scale", label: "Шкала" },
];

const usesOptions = (type: QuestionType) =>
  type === "multiple_choice" || type === "checkboxes" || type === "dropdown";

const createQuestion = (type: QuestionType = "short_answer"): Question => ({
  id: `question-${generateId()}`,
  title: "Новый вопрос",
  description: "",
  type,
  required: false,
  options:
    type === "multiple_choice" || type === "checkboxes" || type === "dropdown"
      ? ["Вариант 1"]
      : [],
  scale:
    type === "linear_scale"
      ? { min: 1, max: 5, minLabel: "Минимум", maxLabel: "Максимум" }
      : undefined,
});

export default function TeamFormBuilder() {
  const [formTitle, setFormTitle] = useState("Новая форма");
  const [formDescription, setFormDescription] = useState(
    "Добавьте описание для участников команды.",
  );
  const [questions, setQuestions] = useState<Question[]>([
    createQuestion("short_answer"),
  ]);
  const [activeQuestionId, setActiveQuestionId] = useState<string>(
    questions[0]?.id ?? "",
  );

  const setQuestion = (questionId: string, update: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId ? { ...question, ...update } : question,
      ),
    );
  };

  const handleTypeChange = (questionId: string, nextType: QuestionType) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        return {
          ...question,
          type: nextType,
          options: usesOptions(nextType)
            ? question.options.length > 0
              ? question.options
              : ["Вариант 1"]
            : [],
          scale:
            nextType === "linear_scale"
              ? question.scale ?? {
                  min: 1,
                  max: 5,
                  minLabel: "Минимум",
                  maxLabel: "Максимум",
                }
              : undefined,
        };
      }),
    );
  };

  const handleDuplicate = (questionId: string) => {
    let duplicatedId = "";
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === questionId);
      if (index === -1) return prev;
      const duplicate = {
        ...prev[index],
        id: `question-${generateId()}`,
      };
      duplicatedId = duplicate.id;
      const next = [...prev];
      next.splice(index + 1, 0, duplicate);
      return next;
    });
    if (duplicatedId) {
      setActiveQuestionId(duplicatedId);
    }
  };

  const handleDelete = (questionId: string) => {
    setQuestions((prev) => {
      if (prev.length === 1) return prev;
      const next = prev.filter((question) => question.id !== questionId);
      if (activeQuestionId === questionId && next[0]) {
        setActiveQuestionId(next[0].id);
      }
      return next;
    });
  };

  const handleMove = (questionId: string, direction: "up" | "down") => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === questionId);
      if (index === -1) return prev;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const [question] = next.splice(index, 1);
      next.splice(targetIndex, 0, question);
      return next;
    });
  };

  const handleAddQuestion = () => {
    const newQuestion = createQuestion();
    setQuestions((prev) => [...prev, newQuestion]);
    setActiveQuestionId(newQuestion.id);
  };

  const handleAddOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [...question.options, `Вариант ${question.options.length + 1}`],
            }
          : question,
      ),
    );
  };

  const handleOptionChange = (
    questionId: string,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        const options = [...question.options];
        options[optionIndex] = value;
        return { ...question, options };
      }),
    );
  };

  const handleOptionRemove = (questionId: string, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        if (question.options.length === 1) return question;
        const options = question.options.filter((_, idx) => idx !== optionIndex);
        return { ...question, options };
      }),
    );
  };

  const handleScaleChange = (
    questionId: string,
    field: "min" | "max" | "minLabel" | "maxLabel",
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        const currentScale =
          question.scale ?? {
            min: 1,
            max: 5,
            minLabel: "Минимум",
            maxLabel: "Максимум",
          };
        const nextScale =
          field === "min" || field === "max"
            ? { ...currentScale, [field]: Number(value) }
            : { ...currentScale, [field]: value };
        return { ...question, scale: nextScale };
      }),
    );
  };

  const handleSave = () => {
    console.log("Form builder save payload", {
      title: formTitle,
      description: formDescription,
      questions,
    });
    toast.success(
      "Шаблон формы сохранён локально. Подключите его к нужному API, когда будете готовы."
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-purple-400/30 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 p-6 text-white shadow-2xl">
        <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 space-y-4">
          <div>
            <Label className="text-sm font-medium text-white/80">Название формы</Label>
            <Input
              value={formTitle}
              onChange={(event) => setFormTitle(event.target.value)}
              placeholder="Например, «Регистрация на турнир»"
              className="mt-2 h-14 border-none bg-white/15 text-2xl font-semibold text-white placeholder:text-white/60 focus-visible:ring-2 focus-visible:ring-white/40"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-white/80">Описание</Label>
            <Textarea
              value={formDescription}
              onChange={(event) => setFormDescription(event.target.value)}
              placeholder="Расскажите, зачем нужна форма и что важно знать участникам."
              className="mt-2 min-h-[90px] border-none bg-white/15 text-base text-white placeholder:text-white/60 focus-visible:ring-2 focus-visible:ring-white/40"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleSave}
              className="bg-white text-purple-700 hover:bg-white/90"
            >
              <Save className="size-4" />
              Сохранить форму
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddQuestion}
              className="bg-white/15 text-white hover:bg-white/25"
            >
              <Plus className="size-4" />
              Добавить вопрос
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {questions.map((question, index) => {
            const isActive = activeQuestionId === question.id;
            return (
              <Card
                key={question.id}
                className={`overflow-hidden border-2 transition-all duration-200 ${
                  isActive ? "border-purple-400 shadow-lg" : "border-white/10"
                }`}
              >
                <CardHeader className="flex flex-col gap-4 bg-white/3 backdrop-blur-sm sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveQuestionId(question.id)}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-purple-100 text-purple-700"
                            : "bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                      >
                        <Dot className="size-5" />
                        Вопрос {index + 1}
                      </button>
                    </div>
                    <Input
                      value={question.title}
                      onChange={(event) =>
                        setQuestion(question.id, { title: event.target.value })
                      }
                      placeholder="Заголовок вопроса"
                      className="h-12 border-none bg-white/10 text-lg font-semibold text-white focus-visible:ring-2 focus-visible:ring-purple-400"
                    />
                    <Textarea
                      value={question.description}
                      onChange={(event) =>
                        setQuestion(question.id, {
                          description: event.target.value,
                        })
                      }
                      placeholder="Подсказка для ответа (необязательно)"
                      className="min-h-[70px] border-none bg-white/10 text-sm text-white/80 focus-visible:ring-2 focus-visible:ring-purple-400"
                    />
                  </div>
                  <div className="flex max-w-[220px] flex-col gap-3">
                    <Label className="text-xs uppercase tracking-wide text-white/60">
                      Тип вопроса
                    </Label>
                    <select
                      value={question.type}
                      onChange={(event) =>
                        handleTypeChange(question.id, event.target.value as QuestionType)
                      }
                      className="h-10 rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300/40"
                    >
                      {typeOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-900">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2">
                      <span className="text-xs font-medium text-white/70">Обязательный</span>
                      <Checkbox
                        checked={question.required}
                        onCheckedChange={(checked) =>
                          setQuestion(question.id, {
                            required: checked === true,
                          })
                        }
                        id={`required-${question.id}`}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 bg-background/80">
                  {usesOptions(question.type) && (
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={`${question.id}-option-${optionIndex}`}
                          className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                        >
                          <div className="flex size-6 items-center justify-center rounded-full border border-white/20">
                            {question.type === "checkboxes" ? (
                              <CheckSquare className="size-4 text-purple-300" />
                            ) : question.type === "dropdown" ? (
                              <Circle className="size-4 text-purple-300" />
                            ) : (
                              <Circle className="size-4 text-purple-300" />
                            )}
                          </div>
                          <Input
                            value={option}
                            onChange={(event) =>
                              handleOptionChange(question.id, optionIndex, event.target.value)
                            }
                            placeholder={`Вариант ${optionIndex + 1}`}
                            className="flex-1 border-none bg-transparent text-white focus-visible:ring-2 focus-visible:ring-purple-400"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOptionRemove(question.id, optionIndex)}
                            disabled={question.options.length === 1}
                            className="text-white/60 hover:text-red-400"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full border border-dashed border-white/20 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => handleAddOption(question.id)}
                      >
                        <Plus className="size-4" />
                        Добавить вариант
                      </Button>
                    </div>
                  )}

                  {question.type === "linear_scale" && (
                    <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase text-white/60">Минимум</Label>
                          <Input
                            type="number"
                            min={0}
                            max={10}
                            value={question.scale?.min ?? 1}
                            onChange={(event) =>
                              handleScaleChange(question.id, "min", event.target.value)
                            }
                            className="border-none bg-background/60 text-white focus-visible:ring-2 focus-visible:ring-purple-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase text-white/60">Максимум</Label>
                          <Input
                            type="number"
                            min={question.scale?.min ?? 1}
                            max={10}
                            value={question.scale?.max ?? 5}
                            onChange={(event) =>
                              handleScaleChange(question.id, "max", event.target.value)
                            }
                            className="border-none bg-background/60 text-white focus-visible:ring-2 focus-visible:ring-purple-400"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase text-white/60">
                            Подпись для минимума
                          </Label>
                          <Input
                            value={question.scale?.minLabel ?? "Минимум"}
                            onChange={(event) =>
                              handleScaleChange(question.id, "minLabel", event.target.value)
                            }
                            className="border-none bg-background/60 text-white focus-visible:ring-2 focus-visible:ring-purple-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase text-white/60">
                            Подпись для максимума
                          </Label>
                          <Input
                            value={question.scale?.maxLabel ?? "Максимум"}
                            onChange={(event) =>
                              handleScaleChange(question.id, "maxLabel", event.target.value)
                            }
                            className="border-none bg-background/60 text-white focus-visible:ring-2 focus-visible:ring-purple-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {question.type === "short_answer" && (
                    <div className="rounded-lg border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                      Ответ — короткая строка (участник увидит поле ввода)
                    </div>
                  )}

                  {question.type === "paragraph" && (
                    <div className="rounded-lg border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                      Ответ — развернутый текст (участник увидит большое поле)
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <MessageSquare className="size-4" />
                      Можно добавить пояснение или загрузить изображение через API позже
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMove(question.id, "up")}
                        disabled={index === 0}
                        className="text-white/70 hover:text-white"
                        title="Переместить вверх"
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMove(question.id, "down")}
                        disabled={index === questions.length - 1}
                        className="text-white/70 hover:text-white"
                        title="Переместить вниз"
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicate(question.id)}
                        className="text-white/70 hover:text-white"
                        title="Дублировать вопрос"
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(question.id)}
                        disabled={questions.length === 1}
                        className="text-red-300/70 hover:text-red-400"
                        title="Удалить вопрос"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleAddQuestion}
              className="bg-purple-500 text-white hover:bg-purple-600"
            >
              <Plus className="size-4" />
              Добавить еще один вопрос
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Превью формы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/80">
              <div>
                <p className="text-base font-semibold text-white">{formTitle}</p>
                <p className="text-xs text-white/60">{formDescription}</p>
              </div>
              <ul className="space-y-3">
                {questions.map((question, index) => (
                  <li key={`preview-${question.id}`} className="rounded-lg border border-white/10 bg-background/60 p-3">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-white">
                        {index + 1}. {question.title}
                      </p>
                      {question.required && (
                        <span className="text-xs font-semibold text-red-300">* обязательно</span>
                      )}
                    </div>
                    <p className="text-xs text-white/60">{question.description}</p>
                    <div className="mt-3 text-xs text-white/50">
                      {question.type === "short_answer" && "Короткий ответ"}
                      {question.type === "paragraph" && "Развернутый ответ"}
                      {question.type === "multiple_choice" && `Один вариант из ${question.options.length}`}
                      {question.type === "checkboxes" && `Несколько вариантов из ${question.options.length}`}
                      {question.type === "dropdown" && `Выпадающий список (${question.options.length})`}
                      {question.type === "linear_scale" &&
                        `Шкала от ${question.scale?.min ?? 1} до ${question.scale?.max ?? 5}`}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Как использовать форму</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <p>
                Этот конструктор повторяет структуру Google Forms. Добавляйте вопросы, меняйте типы,
                отмечайте обязательные поля. После подключения API можно будет сохранить шаблон и
                делиться ссылкой с участниками.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Добавьте столько вопросов, сколько нужно команде.</li>
                <li>Используйте разные типы вопросов для точных ответов.</li>
                <li>В правой колонке видно, как форму увидят участники.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
