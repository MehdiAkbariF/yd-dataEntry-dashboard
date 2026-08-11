import { create } from 'zustand';

export interface UserProfile {
  id: string;
  userName: string;
  fullName: string | null;
  phoneNumber: string;
  email: string | null;
  roles?: string[];
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setAuthenticated: (status: boolean) => void;
  logoutState: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setAuthenticated: (status) =>
    set({
      isAuthenticated: status,
      isLoading: false,
    }),

  logoutState: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));