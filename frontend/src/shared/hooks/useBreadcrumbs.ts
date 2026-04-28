"use client"

import { usePathname } from "next/navigation"
import { products } from "@/features/products"

type BreadcrumbItem = {
  label: string
  href: string
}

const dictionary: Record<string, string> = {
  catalog: "Каталог",
  blog: "Блог",
  about: "Об украшениях",
  courses: "Обучение",
  delivery: "Доставка",
  gallery: "Галерея",
  shoes: "Обувь",
  flowers: "Цветы",
  cart: "Корзина",
}

const formatLabel = (segment: string): string => {
  const decoded = decodeURIComponent(segment)

  return (
    dictionary[decoded] ||
    decoded
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
  )
}

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    
    if (segments[index - 1] === "catalog" && !isNaN(Number(segment))) {
      const product = products.find(p => p.id === segment)
      if (product) {
        return {
          label: product.category,
          href,
        }
      }
    }

    return {
      label: formatLabel(segment),
      href,
    }
  })

  return [
    { label: "Главная", href: "/" },
    ...breadcrumbs,
  ]
}