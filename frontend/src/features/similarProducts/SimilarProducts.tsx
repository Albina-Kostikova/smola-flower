'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
        const res = await fetch(`${API_URL}/api/products`)
        if (!res.ok) throw new Error('Failed to fetch')
        const all: Product[] = await res.json()

        const filtered = all
          .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
          .slice(0, 10)

        setSimilar(filtered)
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
      <div className="flex gap-4 mt-4 overflow-x-auto pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="min-w-45 bg-gray-100 rounded-2xl h-48 animate-pulse shrink-0" />
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
    <section className="flex gap-10 mt-10">
      {similar.map(product => (
        <MiniProductCard onAddToCart={handleAddToCart} product={{
    id: product.id,
    title: product.title,
    price: product.price,
    img: product.img,
    description: product.description || '',
  }}/>
      ))}
    </section>
  )
}