// ============================================================
// NEXORA V4 — Studio Session Store
// Studio access is protected by the /studio PIN gate and Supabase
// Edge Functions. No external auth provider is used in V4 Studio PIN mode.
// ============================================================

import { create } from 'zustand';
import type { Admin } from '@/types';
import { clearStudioToken } from '@/lib/supabase/client';

interface AuthStore {
  user: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: Admin | null) => void;
  setLoading: (loading: boolean) => void;
}

const studioAdmin: Admin = {
  uid: 'studio',
  email: 'studio@nexora.local',
  displayName: 'NEXORA Studio',
  role: 'owner',
  permissions: ['all'],
  createdAt: new Date(),
  lastLoginAt: new Date(),
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: studioAdmin,
  isAuthenticated: true,
  isLoading: false,

  login: async () => {
    set({ user: studioAdmin, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    clearStudioToken();
    set({ user: studioAdmin, isAuthenticated: true, isLoading: false });
  },

  setUser: (user) => set({ user: user || studioAdmin, isAuthenticated: true, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export function initAuthListener() {
  useAuthStore.getState().setLoading(false);
  return () => {};
}
