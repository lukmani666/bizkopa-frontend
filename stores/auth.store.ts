import { create } from 'zustand';

interface AuthUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "owner" | "staff";
  isActive: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;

  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;

  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  signUp: async (first_name, last_name, email, password) => {
    set({ loading: true });

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ first_name, last_name, email, password }),
      });

      const data = await res.json();
      set({ loading: false });

      if (!res.ok) {
        return { error: data.message || 'Registration failed' };
      }

      set({ user: data.data.user });
      return { error: null };
    } catch (err) {
      set({ loading: false });
      return { error: 'Network error' };
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      set({ loading: false });

      if (!res.ok) {
        set({ initialized: true });
        return { error: data.message || 'Invalid credentials' };
      }

      set({ user: data.data.user, initialized: true });
      return { error: null };
    } catch (err) {
      set({ loading: false, initialized: true });
      return { error: 'Network error' };
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      set({ user: null, initialized: true, loading: false });
    } catch {
      set({ user: null, initialized: true, loading: false });
    }
  },

  initialize: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        set({ user: null, initialized: true, loading: false });
        return;
      }

      set({ user: data.data, initialized: true, loading: false });
    } catch {
      set({ user: null, initialized: true, loading: false });
    }
  },
}));
