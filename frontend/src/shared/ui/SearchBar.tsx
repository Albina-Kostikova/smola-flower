'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getAllProducts } from '@/shared/api'
import type { Product } from '@/entities/product'
import Image from 'next/image'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts()
        setAllProducts(products)
      } catch (error) {
        console.error('Ошибка загрузки товаров для поиска:', error)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const lowerQuery = debouncedQuery.toLowerCase()
    const filtered = allProducts.filter((product) =>
      product.title.toLowerCase().includes(lowerQuery)
    )

    setResults(filtered.slice(0, 8))
    setIsOpen(filtered.length > 0)
  }, [debouncedQuery, allProducts])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (product: Product) => {
    setIsOpen(false)
    setQuery('')
    router.push(`/catalog/${product.id}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      handleSelect(results[0])
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex items-center gap-2 ml-5">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Введите название"
          className="w-90 border border-(--color-secondary) rounded-4xl text-(--color-secondary) px-3 py-1 focus:outline-none focus:ring-[1.5px] focus:ring-pink-400 focus:text-(--color-primary)"
        />
        <button
          type="submit"
          title="Поиск"
          className="absolute right-3 top-1.9 w-5 h-5 cursor-pointer"
        >
          <Image src="/images/search.svg" alt="Найти" className="contain" width={20} height={20} loading="eager" />
        </button>
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-90 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors text-left"
            >
              <Image
                src={product.img}
                alt={product.title}
                width={40}
                height={40}
                className="rounded-lg object-cover w-10 h-10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                <p className="text-xs text-gray-500">{product.price} ₽</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { SearchBar }