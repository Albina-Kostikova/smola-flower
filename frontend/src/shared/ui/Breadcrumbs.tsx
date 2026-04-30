"use client"

import Link from "next/link"
import { useBreadcrumbs } from "@/shared/hooks"
type BreadcrumbItem = {
  label: string
  href: string
}
export const Breadcrumbs = ({ items }: { items?: BreadcrumbItem[] }) => { 
  const autoItems = useBreadcrumbs()
  const finalItems = items ?? autoItems
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-10">
       {finalItems.map((item, index) => {
        const isLast = index === finalItems.length - 1


        return (
          <span key={item.href} className="flex items-center">
            {isLast ? (
              <span className="text-black font-medium">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-black transition">
                {item.label}
              </Link>
            )}

            {!isLast && <span className="mx-2">/</span>}
          </span>
        )
      })}
    </nav>
  )
}