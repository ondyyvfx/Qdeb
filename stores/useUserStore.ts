import { create } from 'zustand';

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

export const useUserStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
