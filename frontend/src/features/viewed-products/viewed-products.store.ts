'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type ViewedProduct = {
  id: string
  timestamp: number
}

type ViewedProductsStore = {
  viewed: ViewedProduct[]
  addViewed: (productId: string) => void
  clearViewed: () => void
}

const storage =
  typeof window !== 'undefined'
    ? localStorage
    : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }

export const useViewedProductsStore = create<ViewedProductsStore>()(
  persist(
    (set, get) => ({
      viewed: [],

      addViewed: (productId: string) => {
        const viewed = get().viewed
        const filtered = viewed.filter(item => item.id !== productId)
        const newViewed = [{ id: productId, timestamp: Date.now() }, ...filtered].slice(0, 10) // Сохраняем только последние 10 товаров

        set({ viewed: newViewed })
      },

      clearViewed: () => {
        set({ viewed: [] })
      },
    }),
    {
      name: 'viewed-products-storage',
      storage: createJSONStorage(() => storage),
    },
  ),
)
