import { sortProducts } from './sorting'
import type { Product } from '@/entities/product'

describe('sortProducts', () => {
  const mockProducts: Product[] = [
    { id: '1', title: 'Ваза', price: 300, img: '/img1.jpg', category: 'vazochki', stock: true, description: '' },
    { id: '2', title: 'Кольцо', price: 100, img: '/img2.jpg', category: 'sergi', stock: true, description: '' },
    { id: '3', title: 'Браслет', price: 500, img: '/img3.jpg', category: 'broshi', stock: true, description: '' },
    { id: '4', title: 'Апельсин', price: 200, img: '/img4.jpg', category: 'vazochki', stock: true, description: '' },
  ]

  it('returns default order without modification', () => {
    const result = sortProducts(mockProducts, 'default')

    expect(result).toEqual(mockProducts)
    expect(result).not.toBe(mockProducts)
  })

  it('sorts by price ascending', () => {
    const result = sortProducts(mockProducts, 'price-asc')

    expect(result[0].price).toBe(100)
    expect(result[1].price).toBe(200)
    expect(result[2].price).toBe(300)
    expect(result[3].price).toBe(500)
  })

  it('sorts by price descending', () => {
    const result = sortProducts(mockProducts, 'price-desc')

    expect(result[0].price).toBe(500)
    expect(result[1].price).toBe(300)
    expect(result[2].price).toBe(200)
    expect(result[3].price).toBe(100)
  })

  it('sorts by title ascending (А-Я)', () => {
    const result = sortProducts(mockProducts, 'title-asc')

    expect(result[0].title).toBe('Апельсин')
    expect(result[1].title).toBe('Браслет')
    expect(result[2].title).toBe('Ваза')
    expect(result[3].title).toBe('Кольцо')
  })

  it('sorts by title descending (Я-А)', () => {
    const result = sortProducts(mockProducts, 'title-desc')

    expect(result[0].title).toBe('Кольцо')
    expect(result[1].title).toBe('Ваза')
    expect(result[2].title).toBe('Браслет')
    expect(result[3].title).toBe('Апельсин')
  })

  it('sorts by category', () => {
    const result = sortProducts(mockProducts, 'category')

    expect(result[0].category).toBe('broshi')
    expect(result[1].category).toBe('sergi')
    expect(result[2].category).toBe('vazochki')
    expect(result[3].category).toBe('vazochki')
  })

  it('does not modify original array', () => {
    const originalProducts = [...mockProducts]

    sortProducts(mockProducts, 'price-asc')

    expect(mockProducts).toEqual(originalProducts)
  })

  it('handles empty array', () => {
    const result = sortProducts([], 'price-asc')

    expect(result).toEqual([])
  })

  it('handles single item', () => {
    const singleItem = [mockProducts[0]]
    const result = sortProducts(singleItem, 'price-asc')

    expect(result).toEqual(singleItem)
  })

  it('maintains stability when values are equal', () => {
    const productsWithEqualPrice: Product[] = [
      { id: '1', title: 'A', price: 100, img: '/a.jpg', category: 'cat1', stock: true, description: '' },
      { id: '2', title: 'B', price: 100, img: '/b.jpg', category: 'cat2', stock: true, description: '' },
      { id: '3', title: 'C', price: 100, img: '/c.jpg', category: 'cat1', stock: true, description: '' },
    ]

    const result = sortProducts(productsWithEqualPrice, 'price-asc')

    expect(result.length).toBe(3)
    expect(result.every(p => p.price === 100)).toBe(true)
  })
})
