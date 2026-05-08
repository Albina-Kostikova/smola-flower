'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/entities/product'
import { MiniProductCard } from '@/entities/miniProduct'
import { useCartStore } from '../cart'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:3001'

interface SimilarProductsProps {
  currentProduct: Product
}

export function SimilarProducts({ currentProduct }: SimilarProductsProps) {
  const [similar, setSimilar] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCartStore()

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/products?category=${encodeURIComponent(currentProduct.category)}&excludeId=${currentProduct.id}`,
          { next: { revalidate: 3600 } },
        )
        if (!res.ok) throw new Error('Failed to fetch')
        const filtered: Product[] = await res.json()
        setSimilar(filtered.slice(0, 12))
      } catch (err) {
        console.error('Error fetching similar products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSimilar()
  }, [currentProduct.id, currentProduct.category])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />
        ))}
      </div>
    )
  }

  if (similar.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-gray-400">Нет похожих товаров в этой категории</p>
      </div>
    )
  }

  const handleAddToCart = (p: { id: string; title: string; description: string; price: number; img: string }) => {
    addToCart(p)
    console.log('Товар добавлен в корзину:', p.title)
  }

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
      {similar.map(product => (
        <MiniProductCard
          key={product.id}
          onAddToCart={handleAddToCart}
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            img: product.img,
            description: product.description || '',
          }}
        />
      ))}
    </section>
  )
}
