import { renderHook, act, waitFor } from '@testing-library/react'
import { useAllProducts, useProduct, useSearchProducts } from './useProducts'

jest.mock('../api/products', () => ({
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  searchProducts: jest.fn(),
}))

import { getAllProducts, getProductById, searchProducts } from '../api/products'

const mockedGetAllProducts = getAllProducts as jest.Mock
const mockedGetProductById = getProductById as jest.Mock
const mockedSearchProducts = searchProducts as jest.Mock

describe('useAllProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns products on successful fetch', async () => {
    const mockProducts = [
      { id: '1', title: 'Product 1', price: 100, img: '/1.jpg', category: 'cat', stock: true },
      { id: '2', title: 'Product 2', price: 200, img: '/2.jpg', category: 'cat', stock: true },
    ]
    mockedGetAllProducts.mockResolvedValueOnce(mockProducts)

    const { result } = renderHook(() => useAllProducts())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockProducts)
    expect(result.current.error).toBeNull()
  })

  it('returns error on fetch failure', async () => {
    const error = new Error('Failed to fetch')
    mockedGetAllProducts.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useAllProducts())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toEqual(error)
  })

  it('sets loading state correctly', async () => {
    mockedGetAllProducts.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    const { result } = renderHook(() => useAllProducts())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })
})

describe('useProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns product on successful fetch', async () => {
    const mockProduct = { id: '1', title: 'Test Product', price: 100, img: '/1.jpg', category: 'cat', stock: true }
    mockedGetProductById.mockResolvedValueOnce(mockProduct)

    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toEqual(mockProduct)
    expect(result.current.error).toBeNull()
  })

  it('does not fetch when id is empty', async () => {
    const { result } = renderHook(() => useProduct(''))

    expect(result.current.loading).toBe(true)
    expect(mockedGetProductById).not.toHaveBeenCalled()
  })

  it('returns error on fetch failure', async () => {
    const error = new Error('Product not found')
    mockedGetProductById.mockRejectedValueOnce(error)

    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toBeNull()
    expect(result.current.error).toEqual(error)
  })

  it('refetches when id changes', async () => {
    mockedGetProductById.mockResolvedValue({
      id: '1',
      title: 'P1',
      price: 100,
      img: '/1.jpg',
      category: 'cat',
      stock: true,
    })

    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      initialProps: { id: '1' },
    })

    await waitFor(() => {
      expect(result.current.product?.id).toBe('1')
    })

    mockedGetProductById.mockResolvedValue({
      id: '2',
      title: 'P2',
      price: 200,
      img: '/2.jpg',
      category: 'cat',
      stock: true,
    })

    rerender({ id: '2' })

    await waitFor(() => {
      expect(result.current.product?.id).toBe('2')
    })

    expect(mockedGetProductById).toHaveBeenCalledTimes(2)
  })
})

describe('useSearchProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns search results', async () => {
    const mockResults = [{ id: '1', title: 'Gold Ring', price: 5000, img: '/ring.jpg', category: 'rings', stock: true }]
    mockedSearchProducts.mockResolvedValueOnce(mockResults)

    const { result } = renderHook(() => useSearchProducts({ color: 'gold', minPrice: 1000 }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockResults)
    expect(result.current.error).toBeNull()
  })

  it('returns empty array when no results', async () => {
    mockedSearchProducts.mockResolvedValueOnce([])

    const { result } = renderHook(() => useSearchProducts({ color: 'nonexistent' }))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
  })

  it('refetches when filters change', async () => {
    mockedSearchProducts.mockResolvedValue([])

    const { result, rerender } = renderHook(({ filters }) => useSearchProducts(filters), {
      initialProps: { filters: { color: 'red' } },
    })

    await waitFor(() => {
      expect(mockedSearchProducts).toHaveBeenCalledWith({ color: 'red' })
    })

    rerender({ filters: { color: 'blue' } })

    await waitFor(() => {
      expect(mockedSearchProducts).toHaveBeenCalledWith({ color: 'blue' })
    })
  })

  it('handles errors gracefully', async () => {
    mockedSearchProducts.mockRejectedValueOnce(new Error('Search failed'))

    const { result } = renderHook(() => useSearchProducts({}))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Search failed')
  })
})
