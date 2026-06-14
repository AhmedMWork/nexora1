// ============================================================
// NEXORA — Wishlist Store (Zustand + localStorage persistence)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[];
  toggleItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (productId) => {
        const { items } = get();
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) });
        } else {
          set({ items: [...items, productId] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },

      getCount: () => get().items.length,
    }),
    {
      name: 'nexora-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
