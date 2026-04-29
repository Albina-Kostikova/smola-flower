import type { Product } from '@/entities/product'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:3001'

export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`, {
    next: { revalidate: 3600 }
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`)
  }

  return res.json()
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Product with id ${id} not found`)
    }
    throw new Error(`Failed to fetch product: ${res.statusText}`)
  }

  return res.json()
}

export async function searchProducts(filters: {
  color?: string
  form?: string
  material?: string
  minPrice?: number
  maxPrice?: number
}): Promise<Product[]> {
  const params = new URLSearchParams()

  if (filters.color) params.append('color', filters.color)
  if (filters.form) params.append('form', filters.form)
  if (filters.material) params.append('material', filters.material)
  if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())

  const res = await fetch(`${API_URL}/api/products/search?${params.toString()}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`Failed to search products: ${res.statusText}`)
  }

  return res.json()
}
