'use client'

import { useRouter } from 'next/navigation'
import { Product } from './types'
import { PinkButton } from '@/shared/ui/Buttons'
import Image from 'next/image'

type Props = {
  product: Product
  priority?: boolean
  onAddToCart?: (product: Product) => void
}

export const ProductCard = ({ product, priority = false, onAddToCard }: Props) => {
  const router = useRouter()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if(onAddToCard) {
      onAddToCard(product)
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
    <div className="flex flex-col items-center justify-between border border-gray-300 rounded-4xl pb-5 w-70 h-107 text-white">
      <div className="relative w-70 h-70 group overflow-hidden rounded-4xl cursor-pointer" onClick={handleViewProduct}>
        <Image
          src={product.img}
          alt={product.title}
          width={280}
          height={280}
          className="object-cover"
          priority={priority}
        />

        <div className="absolute inset-0 bg-pink-500/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <button onClick={handleViewProduct} className="cursor-pointer" title="Просмотр">
            <PinkButton text="Просмотр" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 mt-2 text-black">{product.title}</h3>
      <h4 className="tall scale-x-90 text-4xl text-black">
        {product.price} <span className="text-2xl">₽</span>
      </h4>
      <button onClick={handleAddToCart} className="cursor-pointer mt-2" title="В корзину">
        <PinkButton text="В корзину" />
      </button>
    </div>
  )
}
