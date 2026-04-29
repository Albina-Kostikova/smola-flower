'use client'

import { usePathname } from 'next/navigation'

type BreadcrumbItem = {
  label: string
  href: string
}

const dictionary: Record<string, string> = {
  catalog: 'Каталог',
  blog: 'Блог',
  about: 'Об украшениях',
  lessons: 'Обучение',
  delivery: 'Доставка',
  gallery: 'Галерея',
  shoes: 'Обувь',
  flowers: 'Цветы',
  cart: 'Корзина',
}

const formatLabel = (segment: string): string => {
  const decoded = decodeURIComponent(segment)

  return dictionary[decoded] || decoded.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')

    return {
      label: formatLabel(segment),
      href,
    }
  })

  return [{ label: 'Главная', href: '/' }, ...breadcrumbs]
}
