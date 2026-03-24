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
    const raw = localStorage.getItem('authUser');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
})();

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    set({ user, accessToken: token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  initAuth: () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      localStorage.removeItem('authUser');
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
}));
