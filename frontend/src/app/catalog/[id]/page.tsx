'use client'

import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { PinkButton, SquareButton } from '@/shared/ui/Buttons'
import { useState, useEffect } from 'react'
import { getProductById } from '@/shared/api'
import type { Product } from '@/entities/product'
import { ViewedProducts } from '@/features/viewedProducts/viewedProducts'
import Image from 'next/image'
import { useCartStore } from '@/features/cart/cart.store'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart } = useCartStore()

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
        <div className="flex flex-col justify-center items-center h-64">
          <Image src="/images/spiner.svg" alt="Loading..." width={200} height={200}/>
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
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: product.title, href: `/catalog/${product.id}` },
  ]
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-4 pb-8">
      <Breadcrumbs items={breadcrumbs}/>
      <div className="flex">
        <div className="flex mr-8">
          <Image src={product.img} alt={product.title} className="mr-4 object-cover rounded-4xl" width={350} height={350}/>
          <div className="flex flex-col gap-4">
            <Image src={product.img2 || product.img} alt="Фото 2" width={174} height={168}/>
            <Image src={product.img3 || product.img} alt="Фото 3"  width={174} height={168}/>
          </div>
        </div>
        <div className="flex flex-col border border-gray-300 rounded-2xl p-9 leading-9">
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <div className="flex items-center gap-12 py-7">
            <h3 className="tall text-4xl">{product.price} <span className="text-2xl">₽</span></h3>
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
      <div>
        <ViewedProducts 
  product={product} 
  onAddToCart={(item) => addToCart({
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    img: item.img,
  })}
/>
      </div>
    </section>
  )
}
