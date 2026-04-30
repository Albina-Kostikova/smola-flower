'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/entities/product'

type ViewedProduct = {
  id: string
  title: string
  img: string
  category: string
  timestamp: number
  price: number
  description: string
}

type ViewedProductsStore = {
  viewed: ViewedProduct[]
  addViewed: (product: Product) => void
  clearViewed: () => void
}

export const useViewedProductsStore = create<ViewedProductsStore>()(
  persist(
    (set, get) => ({
      viewed: [],

      addViewed: (product) => {
        const current = get().viewed

        const filtered = current.filter((p) => p.id !== product.id)

        const newItem: ViewedProduct = {
          id: product.id,
          title: product.title,
          img: product.img,
          category: product.category,
          timestamp: Date.now(),
          price: product.price,
          description: product.description
        }

        set({
          viewed: [newItem, ...filtered].slice(0, 10),
        })
      },

      clearViewed: () => set({ viewed: [] }),
    }),
    {
      name: 'viewed-products-storage',
    }
  )
)