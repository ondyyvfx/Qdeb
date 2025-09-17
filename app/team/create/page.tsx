"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error("Введите название команды");
      return;
    }

    try {
      setLoading(true);

      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // JWT now sent via Authorization header
        body: JSON.stringify({ name: teamName }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Не удалось создать команду");
      }

      const data = await res.json();

      toast.success(`Команда "${data.name}" создана 🎉`);

      router.push("/team");
    } catch (err: any) {
      toast.error(err.message || "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Создать команду</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Введите название команды"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Создание..." : "Создать"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
