'use client'

import { useRouter } from 'next/navigation'
import { Product } from './types'
import { PinkButton } from '@/shared/ui/Buttons'
import Image from 'next/image'

type Props = {
  product: Product
  priority?: boolean
  onAddToCart: (product: Product) => void
}

export const ProductCard = ({ product, priority = false, onAddToCart }: Props) => {
  const router = useRouter()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart(product)
    } else {
      console.log('Товар добавлен в корзину:', product.title)
    }
  }

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/catalog/${product.id}`)
  }

  return (
    <div className="flex flex-col items-center justify-between border border-gray-300 rounded-4xl pb-3 sm:pb-5 w-full sm:w-70 h-auto sm:h-107 text-white mb-3 sm:mb-5">
      <div
        className="relative w-full sm:w-70 aspect-square sm:h-70 group overflow-hidden rounded-4xl cursor-pointer"
        onClick={handleViewProduct}>
        <Image
          src={product.img}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 45vw, 280px"
          className="object-cover"
          priority={priority}
        />

        <div className="absolute inset-0 bg-pink-500/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <button onClick={handleViewProduct} className="cursor-pointer" title="Просмотр">
            <PinkButton text="Просмотр" />
          </button>
        </div>
      </div>

      <h3 className="text-xs sm:text-lg font-bold mb-1 sm:mb-2 mt-1 sm:mt-2 text-black text-center px-1 sm:px-0">
        {product.title}
      </h3>
      <h4 className="tall scale-x-90 text-xl sm:text-4xl text-black">
        {product.price} <span className="text-sm sm:text-2xl">₽</span>
      </h4>
      <button onClick={handleAddToCart} className="cursor-pointer mt-1 sm:mt-2" title="В корзину">
        <PinkButton text="В корзину" />
      </button>
    </div>
  )
}
