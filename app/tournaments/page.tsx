"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Filter, Plus } from "lucide-react";
import Link from "next/link";
import TournamentCard from "@/components/shared/TournamentCard";
import { useUserStore } from "@/stores/useUserStore";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

type Tournament = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  cost: number;
  location: string;
  registrationlink: string | null;
  backgroundUrl: string;
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "price">("date");

  const { user } = useUserStore();

  // Пока что разрешаем всем создавать турниры
  const isOrganizer = true;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api";

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/tournaments/getAll`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        const formattedTournaments = Array.isArray(data) ? data.map((t: any) => ({
          id: t.id,
          title: t.name,
          start_date: t.eventDate,
          end_date: t.eventDate,
          cost: t.fee || 0,
          location: t.organizerName || "Место не указано",
          registrationlink: t.tabbycatUrl || null,
          backgroundUrl: t.photoUrl ? `${API_URL}${t.photoUrl}` : "/assets/Q.svg",
        })) : [];

        setTournaments(formattedTournaments);
        setFilteredTournaments(formattedTournaments);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        setError("Не удалось загрузить турниры. Попробуйте позже.");
        setTournaments([]);
        setFilteredTournaments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTournaments(tournaments);
    } else {
      const filtered = tournaments.filter((tournament) =>
        tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTournaments(filtered);
    }
  }, [searchTerm, tournaments]);

  const sortByDate = () => {
    setSortBy("date");
    const sorted = [...filteredTournaments].sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    setFilteredTournaments(sorted);
  };

  const sortByPrice = () => {
    setSortBy("price");
    const sorted = [...filteredTournaments].sort((a, b) => a.cost - b.cost);
    setFilteredTournaments(sorted);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-lg">Загрузка турниров...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Ошибка</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-white/10 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1"></div>
              <div className="flex-1 text-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Турниры
                </h1>
              </div>
              <div className="flex-1 flex justify-end">
                <Link href="/tournaments/create">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold px-6 py-3 transition-all duration-300 transform hover:scale-105">
                    <Plus className="w-5 h-5" />
                    Создать турнир
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">
              Просматривайте все доступные турниры, ищите по названию и регистрируйтесь
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Поиск турниров..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300"
                />
              </div>

              {/* Sort Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={sortByDate}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-6 py-3 transition-all duration-300"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  По дате
                </Button>
                <Button
                  onClick={sortByPrice}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-6 py-3 transition-all duration-300"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  По цене
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Найдено турниров: {filteredTournaments.length}
          </p>
        </div>

        {/* Tournaments Grid */}
        {filteredTournaments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/5 rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold mb-2">Турниры не найдены</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm ? "Попробуйте изменить поисковый запрос" : "Пока нет доступных турниров"}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Очистить поиск
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                id={tournament.id}
                title={tournament.title}
                start_date={tournament.start_date}
                end_date={tournament.end_date}
                cost={tournament.cost}
                location={tournament.location}
                registrationlink={tournament.registrationlink}
                backgroundUrl={tournament.backgroundUrl}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}