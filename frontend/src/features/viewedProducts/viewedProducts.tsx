'use client'
import { useEffect } from 'react'
import { useViewedProductsStore } from './viewedProducts.store'
import type { Product } from '@/entities/product'
import { MiniProductCard } from '@/entities/miniProduct/miniProductCard'

type Props = {
  product: Product
  onAddToCart: (item: { id: string; title: string; description: string; price: number; img: string }) => void
}

export const ViewedProducts = ({ product, onAddToCart }: Props) => {
  const viewed = useViewedProductsStore((s) => s.viewed)
  const addViewed = useViewedProductsStore((s) => s.addViewed)

  useEffect(() => {
    if (product) {
      addViewed(product)
    }
  }, [product, addViewed])

  if (!viewed.length) return null

  const handleAddToCart = (p: { id: string; title: string; description: string; price: number; img: string }) => {
    onAddToCart(p)
    console.log('Товар добавлен в корзину:', p.title)
  }

  return (
    <section className="flex gap-10 mt-10">
        {viewed.map((p) => (
          <MiniProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
        ))}
    </section>
  )
}