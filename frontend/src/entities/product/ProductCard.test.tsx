import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from './ProductCard'
import type { Product } from './types'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
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
  title: 'Тестовое украшение',
  price: 2500,
  description: 'Красивое украшение из смолы',
  category: 'vazochki',
  img: '/test.jpg',
  stock: true,
}

describe('ProductCard', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders product title and price', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />)

    expect(screen.getByText('Тестовое украшение')).toBeInTheDocument()
    expect(screen.getByText('2500')).toBeInTheDocument()
  })

  it('renders add to cart button', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />)

    expect(screen.getByRole('button', { name: /в корзину/i })).toBeInTheDocument()
  })

  it('calls onAddToCart when add to cart button is clicked', async () => {
    const user = userEvent.setup()
    const onAddToCart = jest.fn()

    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)

    await user.click(screen.getByRole('button', { name: /в корзину/i }))
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct)
  })

  it('navigates to product page when image is clicked', async () => {
    const user = userEvent.setup()

    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />)

    const imageContainer = screen.getByRole('button', { name: /просмотр/i }).closest('div')?.parentElement
    if (imageContainer) {
      await user.click(imageContainer)
    }

    expect(mockPush).toHaveBeenCalledWith('/catalog/1')
  })

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />)

    const image = screen.getByAltText('Тестовое украшение')
    expect(image).toBeInTheDocument()
  })

  it('does not call onAddToCart when clicking image for navigation', async () => {
    const user = userEvent.setup()
    const onAddToCart = jest.fn()

    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)

    await user.click(screen.getByRole('button', { name: /просмотр/i }))
    expect(mockPush).toHaveBeenCalledWith('/catalog/1')
    expect(onAddToCart).not.toHaveBeenCalled()
  })

  it('renders with priority image when specified', () => {
    render(<ProductCard product={mockProduct} priority onAddToCart={jest.fn()} />)

    const image = screen.getByAltText('Тестовое украшение')

    expect(image).toBeInTheDocument()
  })

  it('logs to console when onAddToCart is not provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    render(<ProductCard product={mockProduct} onAddToCart={undefined as any} />)

    const button = screen.getByRole('button', { name: /в корзину/i })

    button.click()

    expect(consoleSpy).toHaveBeenCalledWith('Товар добавлен в корзину:', mockProduct.title)

    consoleSpy.mockRestore()
  })

  it('displays ruble sign next to price', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />)

    expect(screen.getByText('₽')).toBeInTheDocument()
  })
})
