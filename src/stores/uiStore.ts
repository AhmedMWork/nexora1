// ============================================================
// NEXORA — UI Store
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  isSplashSeen: boolean;
  setSplashSeen: () => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  closeCart: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSplashSeen: false,
      setSplashSeen: () => set({ isSplashSeen: true }),
      isMenuOpen: false,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      closeMenu: () => set({ isMenuOpen: false }),
      isCartOpen: false,
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'nexora-ui',
      partialize: (state) => ({ isSplashSeen: state.isSplashSeen }),
    }
  )
);
