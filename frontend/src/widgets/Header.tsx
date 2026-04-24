'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SearchBar } from '@/features/search/SearchBar'

const underNavItems = [
  { href: '/vazochki', label: 'Вазочки' },
  { href: '/sergi', label: 'Серьги' },
  { href: '/kulony', label: 'Кулоны' },
  { href: '/komplekty', label: 'Комплекты' },
  { href: '/broshi', label: 'Броши' },
  { href: '/chasy-i-kartiny', label: 'Часы и картины' },
]
const navItems = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/aboutProducts', label: 'Об украшениях' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/delivery', label: 'Доставка и оплата' },
  { href: '/blog', label: 'Блог' },
  { href: '/courses', label: 'Обучение' },
]
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <header className="z-40">
      <div className="flex w-full items-center justify-between bg-(--color-primary) px-4 text-white md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          aria-controls="header-mobile-sidebar"
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-2xl leading-none">
          ☰
        </button>

        <Link href="/">
          <img src="./images/logosf.svg" className="h-13 w-25 object-contain" alt="Smola Flowers" priority />
        </Link>

        <Link href="/cart" className="p-2" aria-label="Корзина">
          <img src="./images/cart.svg" alt="Корзина" className="h-8 w-8" />
        </Link>
      </div>

      <div className="hidden py-4 items-center justify-evenly gap-22 w-full bg-(--color-primary) lg:flex">
        <Link href="/">
          <img src="./images/logosf.svg" className="w-25 h-13 contain" alt="Smola Flowers" priority />
        </Link>
        <div className="flex items-center gap-2 whitespace-nowrap text-white uppercase">
          {navItems.map(item => {
            return (
              <Link key={item.href} href={item.href} className=" px-3 py-2 text-base font-medium transition ">
                {item.label}
              </Link>
            )
          })}
        </div>
        <button className="h-8 w-8 contain cursor-pointer">
          <img src="./images/cart.svg" alt="Корзина" className="h-8 w-8 contain invert" />
        </button>

        <button
          type="button"
          aria-label="Open menu"
          aria-controls="header-mobile-sidebar"
          onClick={() => setIsMobileMenuOpen(true)}
          className=" px-3 py-2 text-base font-medium  transition  md:hidden">
          Меню
        </button>
      </div>

      <nav className="bg-white sticky top-0 z-40 mx-auto hidden w-full items-center justify-center px-4 py-3 md:flex">
        <div className="flex items-center">
          {underNavItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 text-(--color-primary) text-base font-medium tracking-wide transition hover:text-pink-700 border-r border-pink-300 last:border-r-0">
              {item.label}
            </Link>
          ))}
        </div>

        <SearchBar />
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="header-mobile-sidebar"
        className={`fixed right-0 top-0 z-50 flex h-dvh w-72 flex-col border-l border-pink-200 bg-white shadow-xl transition-transform md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation">
        <div className="flex items-center justify-between border-b border-pink-100 px-4 py-3">
          <span className="text-base font-semibold text-slate-700">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className=" px-3 py-2 text-sm font-medium  transition ">
            Close
          </button>
        </div>

        <nav className="flex flex-col gap-1 divide-y divide-pink-100 p-4" aria-label="Sidebar navigation">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-pink-50 hover:text-pink-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </header>
  )
}
