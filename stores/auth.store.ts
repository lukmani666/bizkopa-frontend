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
  token: string | null;
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

  signOut: () => void;
  initialize: () => void;
  // setAuth: (data: any) => void;
  // logout: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  initialized: false,

  signUp: async (first_name, last_name, email, password) => {
    set({ loading: true });

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.message || 'Registration failed' };
      }

      localStorage.setItem('token', data.token);

      set({
        user: data.user,
        token: data.token,
        loading: false
      });

      return { error: null };
    } catch (err) {
      set({ loading: false });
      return { error: "Network error" };
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.message || 'Invalid credentials' };
      }

      localStorage.setItem('token', data.token);

      set({
        user: data.user,
        token: data.token,
        loading: false,
        initialized: true,
      });

      return { error: null };
    } catch {
      set({ loading: false });
      return { error: 'Network error' };
    }
  },

  signOut: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, initialized: true });
  },

  initialize: async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      set({ initialized: true });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        localStorage.removeItem('token');
        set({ user: null, token: null, initialized: true });
        return;
      }

      const data = await res.json();

      set({
        user: data.user,
        token,
        initialized: true,
      });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, initialized: true });
    }
  },

}))

// export const useAuthStore = create<AuthState>(set => ({
//   user: null,
//   token: null,
//   setAuth: data => 
//     set({
//       user: data.user,
//       token: data.token
//     }),
//     logout: () => set({ user: null, token: null })
// }));