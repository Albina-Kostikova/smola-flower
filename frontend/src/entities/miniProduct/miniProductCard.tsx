'use client'
import { MiniProduct } from '@/entities/miniProduct'  
import { useRouter } from 'next/navigation'
import { PinkButton } from '@/shared/ui/Buttons'
import Image from 'next/image'
type Props = {
  product: MiniProduct
  onAddToCart? : (product: MiniProduct) => void
}
export function MiniProductCard({product, onAddToCart}: Props) {
    const router = useRouter()
  
    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if(onAddToCart) {
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
      <div className="flex flex-col items-center justify-between border border-gray-300 rounded-4xl py-5 w-48 h-84 text-white">
        <div className="relative w-38 h-38 group overflow-hidden rounded-4xl cursor-pointer" onClick={handleViewProduct}>
          <Image
            src={product.img}
            alt={product.title}
            className="object-cover"
            width={150} height={150}
          />
  
          <div className="absolute inset-0 bg-pink-500/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <button onClick={handleViewProduct} className="cursor-pointer" title="Просмотр">
              <PinkButton text="Просмотр" />
            </button>
          </div>
        </div>
  
        <h3 className="text-sm text-black">{product.title}</h3>
        <h4 className="tall scale-x-90 text-xl text-black">
          {product.price} <span className="text-sm">₽</span>
        </h4>
        <button onClick={handleAddToCart} className="cursor-pointer text-sm" title="В корзину">
          <PinkButton text="В корзину" />
        </button>
      </div>
    )
  }