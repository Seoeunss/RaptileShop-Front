import { create } from 'zustand';

export interface User {
  id: number;
  email: string;
  nickname: string;
  region?: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  status: string;
  mustChangePassword?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

const storedUser = (() => {
  try {
    const raw = sessionStorage.getItem('authUser');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
})();

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  accessToken: sessionStorage.getItem('accessToken'),
  isAuthenticated: !!sessionStorage.getItem('accessToken'),

  setAuth: (user, token) => {
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('authUser', JSON.stringify(user));
    set({ user, accessToken: token, isAuthenticated: true });
  },

  clearAuth: () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('authUser');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  initAuth: () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      sessionStorage.removeItem('authUser');
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
}));
