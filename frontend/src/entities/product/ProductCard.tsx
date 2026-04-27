import Image from 'next/image'
import { Product } from './types'
import { PinkButton } from '@/shared/ui/Buttons'

type Props = {
  product: Product
}

export const ProductCard = ({ product }: Props) => {
  return (
    <div className="flex flex-col items-center justify-between border border-gray-300 rounded-4xl pb-5 w-70 h-107 text-white">
      
      <div className="relative w-70 h-70 group overflow-hidden rounded-4xl">
        <Image
          src={product.image}
          alt={product.title}
          width={280}
          height={280}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-pink-500/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <PinkButton text="В корзину" />
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 mt-2 text-black">{product.title}</h3>
      <h4 className="tall scale-x-90 text-4xl text-black">{product.price} <span className="text-2xl">₽</span></h4>
      <PinkButton text="В корзину" />
    </div>
  )
}
