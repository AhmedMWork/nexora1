// ============================================================
// NEXORA — Cart Store (Zustand + localStorage persistence)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { trackEvent } from '@/services/analytics.service';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color?: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number, color?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.size === item.size && (i.color || '') === (item.color || '')
        );

        void trackEvent('add_to_cart', { productId: item.productId, productName: item.name, size: item.size, color: item.color, quantity: item.quantity });
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId && i.size === item.size && (i.color || '') === (item.color || '')
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId, size, color) => {
        const removed = get().items.find((i) => i.productId === productId && i.size === size && (i.color || '') === (color || ''));
        if (removed) void trackEvent('remove_from_cart', { productId, productName: removed.name, size, color: removed.color, quantity: removed.quantity });
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size && (i.color || '') === (color || ''))
          ),
        });
      },

      updateQuantity: (productId, size, quantity, color) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size && (i.color || '') === (color || '')
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'nexora-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
