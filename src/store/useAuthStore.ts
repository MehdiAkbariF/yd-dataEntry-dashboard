import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  userName: string;
  fullName: string | null;
  phoneNumber: string;
  email?: string | null; // ⚠️ فیلد اختیاری
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  setAuthenticated: (status: boolean) => void;
  logoutState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAuthenticated: (status) =>
        set({
          isAuthenticated: status,
        }),

      logoutState: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'yadakchi-auth-session',
    }
  )
);