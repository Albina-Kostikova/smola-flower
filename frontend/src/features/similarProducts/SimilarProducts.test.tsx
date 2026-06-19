import { render, screen, waitFor } from '@testing-library/react'
import { SimilarProducts } from './SimilarProducts'
import type { Product } from '@/entities/product'

jest.mock('@/features/cart', () => ({
  useCartStore: () => ({
    addToCart: jest.fn(),
  }),
}))

jest.mock('@/entities/miniProduct', () => ({
  MiniProductCard: ({ product }: { product: Product }) => (
    <div data-testid={`mini-card-${product.id}`}>{product.title}</div>
  ),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  price: 100,
  img: '/test.jpg',
  category: 'test-category',
  stock: true,
  description: 'Test',
}

const mockSimilarProducts: Product[] = [
  { ...mockProduct, id: '2', title: 'Similar 1' },
  { ...mockProduct, id: '3', title: 'Similar 2' },
]

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('SimilarProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))

    const { container } = render(<SimilarProducts currentProduct={mockProduct} />)

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('fetches similar products by category', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimilarProducts,
    })

    render(<SimilarProducts currentProduct={mockProduct} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/products?category=test-category&excludeId=1`),
        expect.any(Object),
      )
    })
  })

  it('renders similar products', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSimilarProducts,
    })

    render(<SimilarProducts currentProduct={mockProduct} />)

    await waitFor(() => {
      expect(screen.getByTestId('mini-card-2')).toBeInTheDocument()
      expect(screen.getByTestId('mini-card-3')).toBeInTheDocument()
    })
  })

  it('limits similar products to 12', async () => {
    const manyProducts = Array.from({ length: 20 }, (_, i) => ({
      ...mockProduct,
      id: String(i + 2),
      title: `Similar ${i + 1}`,
    }))

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => manyProducts,
    })

    const { container } = render(<SimilarProducts currentProduct={mockProduct} />)

    await waitFor(() => {
      const cards = container.querySelectorAll('[data-testid^="mini-card-"]')
      expect(cards.length).toBeLessThanOrEqual(12)
    })
  })

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Fetch failed'))

    const { container } = render(<SimilarProducts currentProduct={mockProduct} />)

    await waitFor(() => {
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBe(0)
    })
  })

  it('refetches when product changes', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockSimilarProducts,
    })

    const { rerender } = render(<SimilarProducts currentProduct={mockProduct} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    const newProduct = { ...mockProduct, id: '999', category: 'new-category' }
    rerender(<SimilarProducts currentProduct={newProduct} />)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('new-category'), expect.any(Object))
    })
  })
})
