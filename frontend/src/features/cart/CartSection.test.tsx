import { render, screen } from '@testing-library/react'
import { CartSection } from './CartSection'

jest.mock('./cart.store', () => ({
  useCartStore: () => ({
    items: [{ id: '1', title: 'Product 1', price: 100, img: '/img1.jpg', quantity: 2, description: '' }],
    totalPrice: 200,
    totalCount: 2,
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
    addToCart: jest.fn(),
  }),
}))

jest.mock('@/shared/ui/Buttons', () => ({
  PinkButton: ({ text, onClick }: { text: string; onClick?: () => void }) => <button onClick={onClick}>{text}</button>,
}))

jest.mock('@/shared/ui/Toast', () => ({
  Toast: ({ message, isVisible }: { message: string; isVisible: boolean }) => (isVisible ? <div>{message}</div> : null),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

describe('CartSection', () => {
  it('renders cart section when open', () => {
    render(<CartSection isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText(/корзина|cart/i)).toBeInTheDocument()
  })

  it('displays cart items', () => {
    render(<CartSection isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
  })

  it('renders delivery options', () => {
    render(<CartSection isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText(/Самовывоз|delivery/i)).toBeInTheDocument()
  })

  it('renders payment options', () => {
    render(<CartSection isOpen={true} onClose={jest.fn()} />)

    expect(screen.getByText(/Перевод|payment/i)).toBeInTheDocument()
  })

  it('renders form inputs', () => {
    render(<CartSection isOpen={true} onClose={jest.fn()} />)

    expect(document.querySelector('input')).toBeInTheDocument()
  })
})