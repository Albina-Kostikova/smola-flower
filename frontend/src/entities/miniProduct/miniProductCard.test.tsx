import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MiniProductCard } from './miniProductCard'
import type { MiniProduct } from './types'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('@/features/cart', () => ({
  useCartStore: () => ({
    addToCart: jest.fn(),
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

jest.mock('@/shared/ui/Buttons', () => ({
  PinkButton: ({ text, onClick }: { text: string; onClick?: () => void; className?: string }) => (
    <button onClick={onClick}>{text}</button>
  ),
}))

const mockProduct: MiniProduct = {
  id: '1',
  title: 'Test Product',
  price: 500,
  img: '/test.jpg',
  description: 'Test description',
}

describe('MiniProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders product title', () => {
    render(<MiniProductCard product={mockProduct} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('renders product price', () => {
    render(<MiniProductCard product={mockProduct} />)

    expect(screen.getByText(/500/)).toBeInTheDocument()
  })

  it('renders "Просмотр" button', () => {
    render(<MiniProductCard product={mockProduct} />)

    expect(screen.getByText('Просмотр')).toBeInTheDocument()
  })

  it('renders "В корзину" button', () => {
    render(<MiniProductCard product={mockProduct} />)

    expect(screen.getByText('В корзину')).toBeInTheDocument()
  })

  it('renders product image', () => {
    render(<MiniProductCard product={mockProduct} />)

    expect(screen.getByAltText('Test Product')).toBeInTheDocument()
  })

  it('navigates to product page when view button clicked', async () => {
    const user = userEvent.setup()
    render(<MiniProductCard product={mockProduct} />)

    const viewButton = screen.getByText('Просмотр')
    await user.click(viewButton)

    expect(mockPush).toHaveBeenCalledWith('/catalog/1')
  })

  it('calls onAddToCart callback when provided', async () => {
    const user = userEvent.setup()
    const onAddToCart = jest.fn()

    render(<MiniProductCard product={mockProduct} onAddToCart={onAddToCart} />)

    expect(screen.getByText('В корзину')).toBeInTheDocument()
  })
})
