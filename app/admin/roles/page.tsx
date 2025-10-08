"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Shield, Crown } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  roles: string[];
}

const AdminRolesPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  // Проверяем, является ли пользователь админом
  const isAdmin = user?.roles?.includes("ADMIN");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5639/api";

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
      return;
    }
    fetchUsers();
  }, [isAdmin, router]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Здесь должен быть API эндпоинт для получения всех пользователей
      // Пока используем заглушку
      const mockUsers: User[] = [
        {
          id: 1,
          email: "admin@qdeb.kz",
          username: "admin",
          fullName: "Администратор",
          roles: ["ADMIN"]
        },
        {
          id: 2,
          email: "organizer@qdeb.kz",
          username: "organizer",
          fullName: "Организатор",
          roles: ["ORGANIZER"]
        },
        {
          id: 3,
          email: "user@qdeb.kz",
          username: "user",
          fullName: "Обычный пользователь",
          roles: ["USER"]
        }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRoles: string[]) => {
    try {
      setUpdating(userId);
      
      // Здесь должен быть API вызов для обновления ролей
      // const response = await fetch(`${API_URL}/admin/users/${userId}/roles`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${document.cookie.split('accessToken=')[1]?.split(';')[0] || ''}`
      //   },
      //   body: JSON.stringify({ roles: newRoles })
      // });

      // if (response.ok) {
        // Обновляем локальное состояние
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, roles: newRoles } : u
        ));
        toast.success("Роли пользователя обновлены");
      // } else {
      //   toast.error("Ошибка обновления ролей");
      // }
    } catch (error) {
      console.error("Error updating user roles:", error);
      toast.error("Ошибка обновления ролей");
    } finally {
      setUpdating(null);
    }
  };

  const toggleRole = (user: User, role: string) => {
    const newRoles = user.roles.includes(role)
      ? user.roles.filter(r => r !== role)
      : [...user.roles, role];
    
    updateUserRole(user.id, newRoles);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500";
      case "ORGANIZER":
        return "bg-blue-500";
      case "USER":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="w-3 h-3" />;
      case "ORGANIZER":
        return <Shield className="w-3 h-3" />;
      case "USER":
        return <UserPlus className="w-3 h-3" />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Требуется авторизация</CardTitle>
            <CardDescription>
              Для доступа к панели администратора необходимо войти в систему
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Доступ запрещен</CardTitle>
            <CardDescription>
              У вас нет прав для доступа к панели администратора
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} variant="outline" className="w-full">
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-lg">Загрузка пользователей...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Управление ролями</h1>
            <p className="text-lg text-gray-400">
              Назначение и изменение ролей пользователей
            </p>
          </div>

          {/* Поиск */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Поиск пользователей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Список пользователей */}
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-white/5 border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {user.fullName}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {user.email} (@{user.username})
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {user.roles.map((role) => (
                          <Badge
                            key={role}
                            className={`${getRoleColor(role)} text-white flex items-center gap-1`}
                          >
                            {getRoleIcon(role)}
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {["USER", "ORGANIZER", "ADMIN"].map((role) => (
                        <Button
                          key={role}
                          variant={user.roles.includes(role) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleRole(user, role)}
                          disabled={updating === user.id}
                          className={`${
                            user.roles.includes(role)
                              ? getRoleColor(role)
                              : "border-white/20 text-white hover:bg-white/10"
                          }`}
                        >
                          {getRoleIcon(role)}
                          {role}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-400">
                {searchTerm ? "Пользователи не найдены" : "Пользователи не найдены"}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRolesPage;
