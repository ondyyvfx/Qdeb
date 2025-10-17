import { User } from "@/stores/useUserStore";

/**
 * Проверяет, является ли пользователь администратором
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.roles?.includes("ROLE_ADMIN") ?? false;
};

/**
 * Проверяет, авторизован ли пользователь
 */
export const isAuthenticated = (user: User | null): boolean => {
  return user !== null;
};

/**
 * Возвращает список ролей пользователя или пустой массив
 */
export const getUserRoles = (user: User | null): string[] => {
  return user?.roles ?? [];
};

/**
 * Проверяет, имеет ли пользователь определенную роль
 */
export const hasRole = (user: User | null, role: string): boolean => {
  return user?.roles?.includes(role) ?? false;
};

/**
 * Возвращает отформатированную строку с ролями пользователя
 */
export const formatUserRoles = (user: User | null): string => {
  const roles = getUserRoles(user);
  if (roles.length === 0) {
    return "Не определены";
  }
  return roles.join(", ");
};

