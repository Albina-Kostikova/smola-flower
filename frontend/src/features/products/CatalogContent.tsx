'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ProductCard, type Product } from '@/entities/product'
import { useCartStore } from '@/features/cart/cart.store'
import { useScrollToHash } from '@/shared/hooks/useScrollToHash'
import { sortProducts, sortOptions, type SortOption } from './sorting'

type Props = {
  products: Product[]
}
const CATEGORY_MAP = {
  Вазочки: 'vazochki',
  Серьги: 'sergi',
  Кулоны: 'kulony',
  Комплекты: 'komplekty',
  Броши: 'broshi',
  Сувениры: 'suveniry',
} as const

const CATEGORIES = Object.keys(CATEGORY_MAP)

export const CatalogContent = ({ products }: Props) => {
  const { addToCart } = useCartStore()
  const [sortBy, setSortBy] = useState<SortOption>('category')

  useScrollToHash(false)

  const handleAddToCart = useCallback((product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      description: product.description || '',
      price: product.price,
      img: product.img,
    })
    console.log('Товар добавлен в корзину:', product.title)
  }, [addToCart])

  const sortedProducts = useMemo(() => sortProducts(products, sortBy), [products, sortBy])

  if (sortBy === 'category') {
    return (
      <section className="flex flex-col w-full">
        <div className="flex justify-end mb-6 -mt-5">
          <select
            title="Категории"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400">
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {CATEGORIES.map((category, categoryIndex) => {
          const items = sortedProducts.filter((p: Product) => p.category === category)
          if (!items.length) return null
          const categoryId = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP]
          return (
            <div key={category} id={categoryId} className="w-full flex flex-col justify-center">
              <h2 className="text-center mb-8 font-medium">{category}</h2>
              <div className="mt-6 mb-15 grid w-full grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product: Product, index) => {
                  const isPriority = categoryIndex === 0 && index < 6
                  return (
                    <Link className="block w-full place-items-center" key={product.id} href={`/catalog/${product.id}`}>
                      <ProductCard product={product} priority={isPriority} onAddToCart={handleAddToCart} />
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

  return (
    <section className="flex flex-col w-full">
      <div className="flex justify-end mb-6 -mt-5">
        <select
          title="Сортировка"
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortOption)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400">
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Товары не найдены</p>
      ) : (
        <div className="mt-6 mb-15 grid w-full grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product: Product, index) => {
            const isPriority = index < 6
            return (
              <Link className="block w-full" key={product.id} href={`/catalog/${product.id}`}>
                <ProductCard product={product} priority={isPriority} onAddToCart={handleAddToCart} />
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
