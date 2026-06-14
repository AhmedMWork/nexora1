// ============================================================
// NEXORA — Recently Viewed Store
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentlyViewedStore {
  products: string[];
  addProduct: (slug: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (slug) => {
        const { products } = get();
        const filtered = products.filter((s) => s !== slug);
        const updated = [slug, ...filtered].slice(0, 8);
        set({ products: updated });
      },
    }),
    {
      name: 'nexora-recently-viewed',
      partialize: (state) => ({ products: state.products }),
    }
  )
);
