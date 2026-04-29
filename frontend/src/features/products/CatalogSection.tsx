'use client'
import Link from 'next/link'
import { ProductCard, type Product } from '@/entities/product'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { useScrollToHash } from '@/shared/hooks/useScrollToHash'
import { useState, useEffect } from 'react'
import { getAllProducts } from '@/shared/api'

export const CatalogSection = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useScrollToHash()
  const categories = ['Вазочки', 'Серьги', 'Кулоны', 'Комплекты', 'Броши', 'Сувениры']

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Breadcrumbs />
      <section className="flex flex-col items-start w-full">
        {categories.map(category => {
          const items = products.filter((p: Product) => p.category === category)
          if (!items.length) return null
          return (
            <div key={category} id={category} className="w-full">
              <h2 className="text-center mb-8 font-medium">{category}</h2>
              <div className="mt-6 mb-15 grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product: Product) => (
                  <Link key={product.id} href={`/catalog/${product.id}`}>
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
