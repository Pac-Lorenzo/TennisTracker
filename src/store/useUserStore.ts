import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';

interface ProfileData {
  name?: string;
  ranking?: string;
  dob?: string | null;
  nationality?: string;
  notes?: string;
  createdAt?: any;
}

interface UserState {
  user: (User & ProfileData) | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
      logout: () => set(() => ({ user: null })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
