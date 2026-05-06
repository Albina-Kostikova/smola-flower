import type { Product } from '@/entities/product'

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'category'

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'title-asc', label: 'Название: А-Я' },
  { value: 'title-desc', label: 'Название: Я-А' },
  { value: 'category', label: 'По категории' },
]

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)

    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ru'))

    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title, 'ru'))

    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category, 'ru'))

    case 'default':
    default:
      return sorted
  }
}