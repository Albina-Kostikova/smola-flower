import Link from 'next/link'
import { ProductCard } from '@/entities/product'
import { products } from '../products'

export const CatalogSection = () => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-(--color-primary)">Каталог</h1>
      <p className="mt-3 text-slate-600">Украшения ручной работы из смолы.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </section>
  )
}
