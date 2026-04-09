import { Product } from '../model/types';
export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="border p-4 rounded-xl">
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-4" />
      <h2 className="text-lg font-bold mb-2">{product.title}</h2>
      <p className="">${product.price} ₽</p>
    </div>
  )
}