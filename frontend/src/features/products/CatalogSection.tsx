import Link from 'next/link'
import { ProductCard } from '@/entities/product'
import { products } from '.'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'

export const CatalogSection = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Breadcrumbs />
      <section className="flex flex-col items-start w-full">
        <h1 className="text-2xl font-semibold text-(--color-primary)">Каталог</h1>
        <p className="mt-3 text-slate-600">Украшения ручной работы из смолы.</p>

        <div className="mt-6 grid w-full grid-cols-1 gap-20 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
