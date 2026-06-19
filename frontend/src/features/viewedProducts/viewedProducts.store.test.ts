import { renderHook, act } from '@testing-library/react'
import { useViewedProductsStore } from './viewedProducts.store'
import type { Product } from '@/entities/product'

describe('useViewedProductsStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useViewedProductsStore())
    act(() => {
      result.current.clearViewed()
    })
  })

  const mockProduct: Product = {
    id: '1',
    title: 'Test Product',
    img: '/test.jpg',
    category: 'test-category',
    price: 100,
    description: 'Test description',
    stock: true,
  }

  it('initializes with empty viewed array', () => {
    const { result } = renderHook(() => useViewedProductsStore())

    expect(result.current.viewed).toEqual([])
  })

  it('adds product to viewed list', () => {
    const { result } = renderHook(() => useViewedProductsStore())

    act(() => {
      result.current.addViewed(mockProduct)
    })

    expect(result.current.viewed).toHaveLength(1)
    expect(result.current.viewed[0].id).toBe('1')
    expect(result.current.viewed[0].title).toBe('Test Product')
  })

  it('moves recently viewed product to front', () => {
    const { result } = renderHook(() => useViewedProductsStore())

    const product1 = { ...mockProduct, id: '1', title: 'Product 1' }
    const product2 = { ...mockProduct, id: '2', title: 'Product 2' }

    act(() => {
      result.current.addViewed(product1)
      result.current.addViewed(product2)
      result.current.addViewed(product1)
    })

    expect(result.current.viewed[0].id).toBe('1')
    expect(result.current.viewed[1].id).toBe('2')
  })

  it('maintains only 10 most recent viewed products', () => {
    const { result } = renderHook(() => useViewedProductsStore())

    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.addViewed({
          ...mockProduct,
          id: String(i),
          title: `Product ${i}`,
        })
      }
    })

    expect(result.current.viewed).toHaveLength(10)
  })

  it('removes duplicates keeping only most recent', () => {
    const { result } = renderHook(() => useViewedProductsStore())

    act(() => {
      result.current.addViewed(mockProduct)
      result.current.addViewed({ ...mockProduct, id: '2', title: 'Product 2' })
      result.current.addViewed(mockProduct)
    })

    expect(result.current.viewed).toHaveLength(2)
    expect(result.current.viewed[0].id).toBe('1')
  })

  it('clears viewed products', () => {
    const { result } = renderHook(() => useViewedProductsStore())

    act(() => {
      result.current.addViewed(mockProduct)
    })

    expect(result.current.viewed).toHaveLength(1)

    act(() => {
      result.current.clearViewed()
    })

    expect(result.current.viewed).toEqual([])
  })

  it('stores timestamp for each viewed product', () => {
    const { result } = renderHook(() => useViewedProductsStore())

    act(() => {
      result.current.addViewed(mockProduct)
    })

    expect(result.current.viewed[0]).toHaveProperty('timestamp')
    expect(typeof result.current.viewed[0].timestamp).toBe('number')
  })

  it('preserves product data correctly', () => {
    const { result } = renderHook(() => useViewedProductsStore())

    const product = {
      ...mockProduct,
      id: 'test-id',
      title: 'Test Title',
      img: '/test-img.jpg',
      category: 'test-cat',
      price: 999,
      description: 'Test desc',
    }

    act(() => {
      result.current.addViewed(product)
    })

    const viewed = result.current.viewed[0]
    expect(viewed.id).toBe('test-id')
    expect(viewed.title).toBe('Test Title')
    expect(viewed.img).toBe('/test-img.jpg')
    expect(viewed.category).toBe('test-cat')
    expect(viewed.price).toBe(999)
    expect(viewed.description).toBe('Test desc')
  })
})
