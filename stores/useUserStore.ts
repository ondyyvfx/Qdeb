import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  email: string
  full_name: string
  phone?: string
  description?: string
  elo_rating?: number
  tournaments_completed?: number
  avg_speech?: number
  std_deviation?: number
  total_achievements?: number
  avatar: string // URL на аватарку
  roles?: string[] // Роли пользователя (USER, ORGANIZER, ADMIN)
  // achievements?: Achievement[] // если понадобится
}


type State = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage', // название ключа в localStorage
    }
  )
); 