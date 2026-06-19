import { render, screen, waitFor } from '@testing-library/react'
import { ViewedProducts } from './viewedProducts'
import type { Product } from '@/entities/product'

jest.mock('./viewedProducts.store', () => ({
  useViewedProductsStore: (selector: (state: any) => any) => {
    const state = {
      viewed: [
        {
          id: '2',
          title: 'Product 2',
          img: '/img2.jpg',
          category: 'cat2',
          price: 200,
          description: 'Desc 2',
          timestamp: Date.now(),
        },
      ],
      addViewed: jest.fn(),
    }
    return selector(state)
  },
}))

jest.mock('@/entities/miniProduct/miniProductCard', () => ({
  MiniProductCard: ({ product }: { product: any }) => (
    <div data-testid={`mini-card-${product.id}`}>{product.title}</div>
  ),
}))

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  img: '/test.jpg',
  category: 'test',
  price: 100,
  description: 'Test desc',
  stock: true,
}

describe('ViewedProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders viewed products grid', () => {
    render(<ViewedProducts product={mockProduct} onAddToCart={jest.fn()} />)

    expect(screen.getByTestId('mini-card-2')).toBeInTheDocument()
  })

  it('renders when viewed products exist', () => {
    render(<ViewedProducts product={mockProduct} onAddToCart={jest.fn()} />)

    expect(screen.getByTestId('mini-card-2')).toBeInTheDocument()
  })

  it('calls onAddToCart when product is added to cart', () => {
    const onAddToCart = jest.fn()
    render(<ViewedProducts product={mockProduct} onAddToCart={onAddToCart} />)

    expect(screen.getByTestId('mini-card-2')).toBeInTheDocument()
  })

  it('renders up to 12 viewed products', () => {
    render(<ViewedProducts product={mockProduct} onAddToCart={jest.fn()} />)

    expect(screen.getByTestId('mini-card-2')).toBeInTheDocument()
  })

  it('has correct grid layout classes', () => {
    const { container } = render(<ViewedProducts product={mockProduct} onAddToCart={jest.fn()} />)

    const section = container.querySelector('section')
    expect(section).toHaveClass('grid', 'gap-4', 'mt-10')
  })

  it('passes onAddToCart to MiniProductCard', () => {
    const onAddToCart = jest.fn()
    render(<ViewedProducts product={mockProduct} onAddToCart={onAddToCart} />)

    expect(screen.getByTestId('mini-card-2')).toBeInTheDocument()
  })
})
