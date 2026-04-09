'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type CartItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];

  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  clearCart: () => void;
  recalc: (items: CartItem[]) => {
    totalCount: number;
    totalPrice: number;
  },

  totalCount: number;
  totalPrice: number;
};
const storage =
  typeof window !== 'undefined'
    ? localStorage
    : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalCount: 0,
      totalPrice: 0,

      recalc: (items: CartItem[]) => ({
        totalCount: items.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      }),

      addToCart: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);

        let updated: CartItem[];

        if (existing) {
          updated = items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          updated = [...items, { ...item, quantity: 1 }];
        }

        set({
          items: updated,
          ...get().recalc(updated),
        });
      },

      removeFromCart: (id) => {
        const updated = get().items.filter((i) => i.id !== id);

        set({
          items: updated,
          ...get().recalc(updated),
        });
      },

      increase: (id) => {
        const updated = get().items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        );

        set({
          items: updated,
          ...get().recalc(updated),
        });
      },

      decrease: (id) => {
        const updated = get().items
          .map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0);

        set({
          items: updated,
          ...get().recalc(updated),
        });
      },

      clearCart: () =>
        set({
          items: [],
          totalCount: 0,
          totalPrice: 0,
        }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);