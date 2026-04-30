'use client'

import Link from 'next/link'
import { ProductCard, type Product } from '@/entities/product'
import { useScrollToHash } from '@/shared/hooks/useScrollToHash'

type Props = {
  products: Product[]
}

export const CatalogContent = ({ products }: Props) => {
  const categoryMap = {
    'Вазочки': 'vazochki',
    'Серьги': 'sergi',
    'Кулоны': 'kulony',
    'Комплекты': 'komplekty',
    'Броши': 'broshi',
    'Сувениры': 'suveniry'
  }
  
  const categories = ['Вазочки', 'Серьги', 'Кулоны', 'Комплекты', 'Броши', 'Сувениры']

  useScrollToHash(false)

  return (
    <section className="flex flex-col w-full">
      {categories.map((category, categoryIndex) => {
        const items = products.filter((p: Product) => p.category === category)
        if (!items.length) return null
        const categoryId = categoryMap[category as keyof typeof categoryMap]
        return (
          <div key={category} id={categoryId} className="w-full flex flex-col justify-center">
            <h2 className="text-center mb-8 font-medium">{category}</h2>
            <div className="mt-6 mb-15 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product: Product, index) => {
                const isPriority = categoryIndex === 0 && index < 6
                return (
                  <Link className="flex justify-center" key={product.id} href={`/catalog/${product.id}`}>
                    <ProductCard product={product} priority={isPriority} />
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </section>
  )
}
