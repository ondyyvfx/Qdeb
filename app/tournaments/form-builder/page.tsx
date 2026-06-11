"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import AdminOnlyPage from "@/components/shared/AdminOnlyPage";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    FileText,
    Plus,
    Save,
    Trash2,
    Undo,
    ArrowLeft,
    ArrowDown,
    ArrowUp,
    CheckSquare,
    Circle,
    Copy,
    Dot,
    MessageSquare,
} from "lucide-react";

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

const STORAGE_KEY = "tournamentRegistrationTemplate";

const generateId = () =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

const usesOptions = (type: RegistrationFieldType) =>
    type === "multiple_choice" || type === "checkboxes" || type === "dropdown";

const createField = (
    type: RegistrationFieldType = "TEXT"
): RegistrationField => ({
    id: `field-${generateId()}`,
    name: "Новое поле",
    title: "Новое поле",
    description: "",
    type,
    required: false,
    options: usesOptions(type) ? ["Вариант 1"] : [],
    scale:
        type === "linear_scale"
            ? { min: 1, max: 5, minLabel: "Минимум", maxLabel: "Максимум" }
            : undefined,
});

const DEFAULT_TEMPLATE: RegistrationField[] = [
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

const loadTemplate = (): RegistrationField[] | null => {
    if (typeof window === "undefined") return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return null;
        const normalized = parsed
            .map((item: unknown) => {
                const field = item as Record<string, unknown>;
                return {
                    id: (typeof field?.id === "string"
                        ? field.id
                        : `field-${generateId()}`) as string,
                    name:
                        typeof field?.name === "string"
                            ? field.name.trim()
                            : "",
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
                    scale:
                        (field?.scale as RegistrationField["scale"]) ||
                        undefined,
                } as RegistrationField;
            })
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
    const { t } = useLanguage();
    const typeOptions: { value: RegistrationFieldType; label: string }[] = [
        { value: "TEXT", label: t.formBuilder.typeShortAnswer },
        { value: "DESCRIPTION", label: t.formBuilder.typeLongAnswer },
        { value: "short_answer", label: t.formBuilder.typeShortAnswer2 },
        { value: "paragraph", label: t.formBuilder.typeLongAnswer },
        { value: "multiple_choice", label: t.formBuilder.typeSingleChoice },
        { value: "checkboxes", label: t.formBuilder.typeMultiChoice },
        { value: "dropdown", label: t.formBuilder.typeDropdown },
        { value: "linear_scale", label: t.formBuilder.typeScale },
    ];
    const typeDescriptions: Record<RegistrationFieldType, string> = {
        TEXT: t.formBuilder.descShortAnswer,
        DESCRIPTION: t.formBuilder.descLongAnswer,
        short_answer: t.formBuilder.descShortAnswer,
        paragraph: t.formBuilder.descLongAnswer,
        multiple_choice: t.formBuilder.descSingleChoice,
        checkboxes: t.formBuilder.descMultiChoice,
        dropdown: t.formBuilder.descDropdown,
        linear_scale: t.formBuilder.descScale,
    };
    const [fields, setFields] = useState<RegistrationField[]>(DEFAULT_TEMPLATE);
    const [saving, setSaving] = useState(false);
    const [activeFieldId, setActiveFieldId] = useState<string>(
        fields[0]?.id ?? ""
    );

    useEffect(() => {
        const saved = loadTemplate();
        if (saved) {
            setFields(saved);
            setActiveFieldId(saved[0]?.id ?? "");
        }
    }, []);

    const setField = (fieldId: string, update: Partial<RegistrationField>) => {
        setFields((prev) =>
            prev.map((field) =>
                field.id === fieldId ? { ...field, ...update } : field
            )
        );
    };

    const handleTypeChange = (
        fieldId: string,
        nextType: RegistrationFieldType
    ) => {
        setFields((prev) =>
            prev.map((field) => {
                if (field.id !== fieldId) return field;
                return {
                    ...field,
                    type: nextType,
                    options: usesOptions(nextType)
                        ? field.options.length > 0
                            ? field.options
                            : ["Вариант 1"]
                        : [],
                    scale:
                        nextType === "linear_scale"
                            ? field.scale ?? {
                                  min: 1,
                                  max: 5,
                                  minLabel: "Минимум",
                                  maxLabel: "Максимум",
                              }
                            : undefined,
                };
            })
        );
    };

    const handleDuplicate = (fieldId: string) => {
        let duplicatedId = "";
        setFields((prev) => {
            const index = prev.findIndex((f) => f.id === fieldId);
            if (index === -1) return prev;
            const duplicate = {
                ...prev[index],
                id: `field-${generateId()}`,
                name: `${prev[index].name} (копия)`,
                title: `${prev[index].title} (копия)`,
            };
            duplicatedId = duplicate.id;
            const next = [...prev];
            next.splice(index + 1, 0, duplicate);
            return next;
        });
        if (duplicatedId) {
            setActiveFieldId(duplicatedId);
        }
    };

    const handleDelete = (fieldId: string) => {
        setFields((prev) => {
            if (prev.length === 1) return prev;
            const next = prev.filter((field) => field.id !== fieldId);
            if (activeFieldId === fieldId && next[0]) {
                setActiveFieldId(next[0].id);
            }
            return next;
        });
    };

    const handleMove = (fieldId: string, direction: "up" | "down") => {
        setFields((prev) => {
            const index = prev.findIndex((f) => f.id === fieldId);
            if (index === -1) return prev;
            const targetIndex = direction === "up" ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= prev.length) return prev;
            const next = [...prev];
            const [field] = next.splice(index, 1);
            next.splice(targetIndex, 0, field);
            return next;
        });
    };

    const handleAddField = () => {
        const newField = createField();
        setFields((prev) => [...prev, newField]);
        setActiveFieldId(newField.id);
    };

    const handleAddOption = (fieldId: string) => {
        setFields((prev) =>
            prev.map((field) =>
                field.id === fieldId
                    ? {
                          ...field,
                          options: [
                              ...field.options,
                              `Вариант ${field.options.length + 1}`,
                          ],
                      }
                    : field
            )
        );
    };

    const handleOptionChange = (
        fieldId: string,
        optionIndex: number,
        value: string
    ) => {
        setFields((prev) =>
            prev.map((field) => {
                if (field.id !== fieldId) return field;
                const options = [...field.options];
                options[optionIndex] = value;
                return { ...field, options };
            })
        );
    };

    const handleOptionRemove = (fieldId: string, optionIndex: number) => {
        setFields((prev) =>
            prev.map((field) => {
                if (field.id !== fieldId) return field;
                if (field.options.length === 1) return field;
                const options = field.options.filter(
                    (_, idx) => idx !== optionIndex
                );
                return { ...field, options };
            })
        );
    };

    const handleScaleChange = (
        fieldId: string,
        scaleField: "min" | "max" | "minLabel" | "maxLabel",
        value: string
    ) => {
        setFields((prev) =>
            prev.map((field) => {
                if (field.id !== fieldId) return field;
                const currentScale = field.scale ?? {
                    min: 1,
                    max: 5,
                    minLabel: "Минимум",
                    maxLabel: "Максимум",
                };
                const nextScale =
                    scaleField === "min" || scaleField === "max"
                        ? { ...currentScale, [scaleField]: Number(value) }
                        : { ...currentScale, [scaleField]: value };
                return { ...field, scale: nextScale };
            })
        );
    };

    const handleResetTemplate = () => {
        setFields(DEFAULT_TEMPLATE);
        setActiveFieldId(DEFAULT_TEMPLATE[0]?.id ?? "");
        toast.success(t.formBuilder.templateReset);
    };

    const handleSaveTemplate = () => {
        const sanitized = fields
            .map((field) => ({
                ...field,
                name: field.name.trim(),
                title: field.title.trim(),
                description: field.description.trim(),
            }))
            .filter((field) => field.name.length > 0);

        if (sanitized.length === 0) {
            toast.error(t.formBuilder.addFieldFirst);
            return;
        }

        setSaving(true);
        try {
            saveTemplate(sanitized);
            setFields(sanitized);
            toast.success(t.formBuilder.templateSaved);
        } catch (error) {
            console.error("Failed to save template:", error);
            toast.error(t.formBuilder.couldNotSaveTemplate);
        } finally {
            setSaving(false);
        }
    };

    const handleBackToCreate = () => {
        router.push("/tournaments/create");
    };

    return (
        <AdminOnlyPage
            title={t.formBuilder.builderTitle}
            message={t.formBuilder.onlyOrganizers}
        >
            <div className="min-h-screen bg-background text-text">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-semibold text-white flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-accent" />
                                    {t.formBuilder.builderTitle}
                                </h1>
                                <p className="mt-2 text-gray-400 text-sm md:text-base max-w-2xl">
                                    {t.formBuilder.builderSubtitle}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleBackToCreate}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    {t.formBuilder.backToCreate}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleResetTemplate}
                                    className="flex items-center gap-2"
                                >
                                    <Undo className="w-4 h-4" />
                                    {t.formBuilder.reset}
                                </Button>
                                <Button
                                    onClick={handleSaveTemplate}
                                    disabled={saving}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving
                                        ? t.formBuilder.saving
                                        : t.formBuilder.saveTemplate}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                            <div className="space-y-6">
                                {fields.map((field, index) => {
                                    const isActive = activeFieldId === field.id;
                                    return (
                                        <Card
                                            onClick={() =>
                                                setActiveFieldId(field.id)
                                            }
                                            key={field.id}
                                            className={`overflow-hidden border-2 transition-all duration-200 ${
                                                isActive
                                                    ? "border-accent shadow-lg"
                                                    : "border-white/10"
                                            }`}
                                        >
                                            <CardHeader className="flex flex-col gap-4 bg-white/3 backdrop-blur-sm sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex flex-1 flex-col gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveFieldId(
                                                                    field.id
                                                                )
                                                            }
                                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                                                                isActive
                                                                    ? "bg-accent/20 text-accent"
                                                                    : "bg-white/10 text-white/80 hover:bg-white/20"
                                                            }`}
                                                        >
                                                            <Dot className="size-5" />
                                                            {t.formBuilder.fieldN(index + 1)}
                                                        </button>
                                                    </div>
                                                    <Input
                                                        value={field.title}
                                                        onChange={(event) =>
                                                            setField(field.id, {
                                                                title: event
                                                                    .target
                                                                    .value,
                                                                name: event
                                                                    .target
                                                                    .value,
                                                            })
                                                        }
                                                        placeholder={t.formBuilder.fieldTitlePlaceholder}
                                                        className="h-12 border-none bg-white/10 text-lg font-semibold text-white focus-visible:ring-2 focus-visible:ring-accent"
                                                    />
                                                    <Textarea
                                                        value={
                                                            field.description
                                                        }
                                                        onChange={(event) =>
                                                            setField(field.id, {
                                                                description:
                                                                    event.target
                                                                        .value,
                                                            })
                                                        }
                                                        placeholder={t.formBuilder.fieldDescPlaceholder}
                                                        className="min-h-[70px] border-none bg-white/10 text-sm text-white/80 focus-visible:ring-2 focus-visible:ring-accent"
                                                    />
                                                </div>
                                                <div className="flex max-w-[220px] flex-col gap-3">
                                                    <Label className="text-xs uppercase tracking-wide text-white/60">
                                                        {t.formBuilder.fieldType}
                                                    </Label>
                                                    <select
                                                        value={field.type}
                                                        onChange={(event) =>
                                                            handleTypeChange(
                                                                field.id,
                                                                event.target
                                                                    .value as RegistrationFieldType
                                                            )
                                                        }
                                                        className="h-10 rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                                                        title={t.formBuilder.fieldType}
                                                    >
                                                        {typeOptions.map(
                                                            (option) => (
                                                                <option
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2">
                                                        <span className="text-xs font-medium text-white/70">
                                                            {t.formBuilder.required}
                                                        </span>
                                                        <Checkbox
                                                            checked={
                                                                field.required
                                                            }
                                                            onCheckedChange={(
                                                                checked
                                                            ) =>
                                                                setField(
                                                                    field.id,
                                                                    {
                                                                        required:
                                                                            checked ===
                                                                            true,
                                                                    }
                                                                )
                                                            }
                                                            id={`required-${field.id}`}
                                                        />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4 bg-background/80">
                                                {usesOptions(field.type) && (
                                                    <div className="space-y-3">
                                                        {field.options.map(
                                                            (
                                                                option,
                                                                optionIndex
                                                            ) => (
                                                                <div
                                                                    key={`${field.id}-option-${optionIndex}`}
                                                                    className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                                                                >
                                                                    <div className="flex size-6 items-center justify-center rounded-full border border-white/20">
                                                                        {field.type ===
                                                                        "checkboxes" ? (
                                                                            <CheckSquare className="size-4 text-accent" />
                                                                        ) : field.type ===
                                                                          "dropdown" ? (
                                                                            <Circle className="size-4 text-accent" />
                                                                        ) : (
                                                                            <Circle className="size-4 text-accent" />
                                                                        )}
                                                                    </div>
                                                                    <Input
                                                                        value={
                                                                            option
                                                                        }
                                                                        onChange={(
                                                                            event
                                                                        ) =>
                                                                            handleOptionChange(
                                                                                field.id,
                                                                                optionIndex,
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder={`Вариант ${
                                                                            optionIndex +
                                                                            1
                                                                        }`}
                                                                        className="flex-1 border-none bg-transparent text-white focus-visible:ring-2 focus-visible:ring-accent"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            handleOptionRemove(
                                                                                field.id,
                                                                                optionIndex
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            field
                                                                                .options
                                                                                .length ===
                                                                            1
                                                                        }
                                                                        className="text-white/60 hover:text-red-400"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            )
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            className="w-full border border-dashed border-white/20 bg-white/5 text-white hover:bg-white/10"
                                                            onClick={() =>
                                                                handleAddOption(
                                                                    field.id
                                                                )
                                                            }
                                                        >
                                                            <Plus className="size-4" />
                                                            {t.formBuilder.addOption}
                                                        </Button>
                                                    </div>
                                                )}

                                                {field.type ===
                                                    "linear_scale" && (
                                                    <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs uppercase text-white/60">
                                                                    {t.formBuilder.min}
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    max={10}
                                                                    value={
                                                                        field
                                                                            .scale
                                                                            ?.min ??
                                                                        1
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleScaleChange(
                                                                            field.id,
                                                                            "min",
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="border-none bg-background/60 text-white focus-visible:ring-2 focus-visible:ring-accent"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs uppercase text-white/60">
                                                                    {t.formBuilder.max}
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    min={
                                                                        field
                                                                            .scale
                                                                            ?.min ??
                                                                        1
                                                                    }
                                                                    max={10}
                                                                    value={
                                                                        field
                                                                            .scale
                                                                            ?.max ??
                                                                        5
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleScaleChange(
                                                                            field.id,
                                                                            "max",
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="border-none bg-background/60 text-white focus-visible:ring-2 focus-visible:ring-accent"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs uppercase text-white/60">
                                                                    {t.formBuilder.minLabelCaption}
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        field
                                                                            .scale
                                                                            ?.minLabel ??
                                                                        "Минимум"
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleScaleChange(
                                                                            field.id,
                                                                            "minLabel",
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="border-none bg-background/60 text-white focus-visible:ring-2 focus-visible:ring-accent"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs uppercase text-white/60">
                                                                    {t.formBuilder.maxLabelCaption}
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        field
                                                                            .scale
                                                                            ?.maxLabel ??
                                                                        "Максимум"
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleScaleChange(
                                                                            field.id,
                                                                            "maxLabel",
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="border-none bg-background/60 text-white focus-visible:ring-2 focus-visible:ring-accent"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {(field.type === "TEXT" ||
                                                    field.type ===
                                                        "short_answer") && (
                                                    <div className="rounded-lg border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                                                        {t.formBuilder.shortAnswerHint}
                                                    </div>
                                                )}

                                                {(field.type ===
                                                    "DESCRIPTION" ||
                                                    field.type ===
                                                        "paragraph") && (
                                                    <div className="rounded-lg border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                                                        {t.formBuilder.longAnswerHint}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                                                    <div className="flex items-center gap-2 text-xs text-white/60">
                                                        <MessageSquare className="size-4" />
                                                        {typeDescriptions[field.type]}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleMove(
                                                                    field.id,
                                                                    "up"
                                                                )
                                                            }
                                                            disabled={
                                                                index === 0
                                                            }
                                                            className="text-white/70 hover:text-white"
                                                            title={t.formBuilder.moveUp}
                                                        >
                                                            <ArrowUp className="size-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleMove(
                                                                    field.id,
                                                                    "down"
                                                                )
                                                            }
                                                            disabled={
                                                                index ===
                                                                fields.length -
                                                                    1
                                                            }
                                                            className="text-white/70 hover:text-white"
                                                            title={t.formBuilder.moveDown}
                                                        >
                                                            <ArrowDown className="size-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDuplicate(
                                                                    field.id
                                                                )
                                                            }
                                                            className="text-white/70 hover:text-white"
                                                            title={t.formBuilder.duplicateField}
                                                        >
                                                            <Copy className="size-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    field.id
                                                                )
                                                            }
                                                            disabled={
                                                                fields.length ===
                                                                1
                                                            }
                                                            className="text-red-300/70 hover:text-red-400"
                                                            title={t.formBuilder.deleteField}
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
                                        onClick={handleAddField}
                                        className="bg-accent text-white hover:bg-accent/90"
                                    >
                                        <Plus className="size-4" />
                                        {t.formBuilder.addAnotherField}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Card className="border-white/10 bg-white/5 backdrop-blur">
                                    <CardHeader>
                                        <CardTitle className="text-white">
                                            {t.formBuilder.formPreview}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm text-white/80">
                                        <div>
                                            <p className="text-base font-semibold text-white">
                                                {t.formBuilder.regFormForTournament}
                                            </p>
                                            <p className="text-xs text-white/60">
                                                {t.formBuilder.fillAllFields}
                                            </p>
                                        </div>
                                        <ul className="space-y-3">
                                            {fields.map((field, index) => (
                                                <li
                                                    key={`preview-${field.id}`}
                                                    className="rounded-lg border border-white/10 bg-background/60 p-3"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <p className="font-medium text-white">
                                                            {index + 1}.{" "}
                                                            {field.title}
                                                        </p>
                                                        {field.required && (
                                                            <span className="text-xs font-semibold text-red-300">
                                                                {t.formBuilder.requiredMark}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-white/60">
                                                        {field.description}
                                                    </p>
                                                    <div className="mt-3 text-xs text-white/50">
                                                        {field.type ===
                                                            "TEXT" &&
                                                            t.formBuilder.previewShortAnswer}
                                                        {field.type ===
                                                            "DESCRIPTION" &&
                                                            t.formBuilder.previewLongAnswer}
                                                        {field.type ===
                                                            "short_answer" &&
                                                            t.formBuilder.previewShortAnswer}
                                                        {field.type ===
                                                            "paragraph" &&
                                                            t.formBuilder.previewLongAnswer}
                                                        {field.type ===
                                                            "multiple_choice" &&
                                                            t.formBuilder.previewSingleChoice(field.options.length)}
                                                        {field.type ===
                                                            "checkboxes" &&
                                                            t.formBuilder.previewMultiChoice(field.options.length)}
                                                        {field.type ===
                                                            "dropdown" &&
                                                            t.formBuilder.previewDropdown(field.options.length)}
                                                        {field.type ===
                                                            "linear_scale" &&
                                                            t.formBuilder.previewScale(
                                                                field.scale?.min ?? 1,
                                                                field.scale?.max ?? 5
                                                            )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card className="border-white/10 bg-white/5 backdrop-blur">
                                    <CardHeader>
                                        <CardTitle className="text-white">
                                            {t.formBuilder.howToUse}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm text-white/70">
                                        <p>{t.formBuilder.howToUseText}</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>{t.formBuilder.tip1}</li>
                                            <li>{t.formBuilder.tip2}</li>
                                            <li>{t.formBuilder.tip3}</li>
                                            <li>{t.formBuilder.tip4}</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </AdminOnlyPage>
    );
}
