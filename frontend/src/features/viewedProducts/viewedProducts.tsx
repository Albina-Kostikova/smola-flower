import { useEffect } from 'react'
import { useViewedProductsStore } from './viewedProducts.store'
import type { Product } from '@/entities/product'
import { MiniProductCard } from '@/entities/miniProduct/miniProductCard'

export const ViewedProducts = ({
  product,
}: {
  product: Product
}) => {
  const viewed = useViewedProductsStore((s) => s.viewed)
  const addViewed = useViewedProductsStore((s) => s.addViewed)

  useEffect(() => {
    if (product) {
      addViewed(product)
    }
  }, [product, addViewed])

  if (!viewed.length) return null

  return (
    <section className="flex gap-10 mt-10">
        {viewed.map((p) => (
          <MiniProductCard key={p.id} product={p}/>
        ))}
    </section>
  )
}