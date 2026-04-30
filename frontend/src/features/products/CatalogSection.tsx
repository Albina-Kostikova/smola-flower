import { type Product } from '@/entities/product'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'
import { getAllProducts } from '@/shared/api'
import { CatalogContent } from './CatalogContent'

export const CatalogSection = async () => {
  let products: Product[] = []
  
  try {
    products = await getAllProducts()
  } catch (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <Breadcrumbs />
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-500">Ошибка загрузки каталога</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Breadcrumbs />
      <CatalogContent products={products} />
    </div>
  )
}
