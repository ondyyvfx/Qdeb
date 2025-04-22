import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: number;
  email: string;
  full_name: string;
  avatar?: string;
  bio?: string;
};

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
