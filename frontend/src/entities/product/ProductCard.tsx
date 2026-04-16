import Image from 'next/image'
import { Product } from './types'

type Props = {
  product: Product
}

export const ProductCard = ({ product }: Props) => {
  return (
    <div className="border p-4 rounded-xl w-70 h-70 text-white bg-linear-to-t from-[#000000] to-[#0000002d]">
      <Image
        src={product.image}
        alt={product.title}
        width={280}
        height={280}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <h2 className="text-lg font-bold mb-2">{product.title}</h2>
    </div>
  )
}
