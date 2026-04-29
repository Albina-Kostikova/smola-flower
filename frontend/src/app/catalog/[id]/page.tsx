'use client'

import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { PinkButton, SquareButton } from '@/shared/ui/Buttons'
import { useState, useEffect } from 'react'
import { getProductById } from '@/shared/api'
import type { Product } from '@/entities/product'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(params.id)
        setProduct(data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Товар не найден')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [params.id])

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <p>Загрузка...</p>
        </div>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <Breadcrumbs />
        <h1 className="text-2xl font-semibold text-(--color-primary)">{error || 'Товар не найден'}</h1>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-4 pb-8">
      <Breadcrumbs />
      <div className="flex">
        <div className="flex">
          <img src={product.img} alt={product.title} className="w-88 h-88 object-cover rounded-4xl" />
          <div className="flex flex-col">
            <img src={product.img2} alt="Фото 2" className="w-43"/>
            <img src={product.img3} alt="Фото 3" className="w-43"/>
          </div>
        </div>
        <div className="flex flex-col border border-gray-300 rounded-2xl p-9 leading-9">
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <div className="flex items-center gap-12 py-7">
            <h3>{product.price} ₽</h3>
            <SquareButton text={product.stock === true ? "В наличии" : "На заказ"} />
          </div>
          <p><b>Техника исполнения:</b> {product.technic}</p>
          <p><b>Диаметр:</b> {product.diameter}</p>
          <p><b>Цвет:</b> {product.color}</p>
          <p><b>Форма:</b> {product.form}</p>
          <p><b>Отделка:</b> {product.material}</p>
          <div className="border-t border-gray-300 pt-6">
            <PinkButton text="В корзину" />
          </div>
        </div>
      </div>
      <h3>Похожие товары</h3>
      <div></div>
      <h3>Вы смотрели ранее</h3>
      <div></div>
    </section>
  )
}
