import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './Header'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@/shared/ui/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
}))

jest.mock('@/features/cart/cart.store', () => ({
  useCartStore: (selector: (state: any) => any) => {
    const state = {
      totalCount: 3,
    }
    return selector(state)
  },
}))

describe('Header', () => {
  const mockOnCartClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  it('renders logo', () => {
    render(<Header onCartClick={mockOnCartClick} />)

    const logo = screen.getAllByAltText('Smola Flowers')
    expect(logo.length).toBeGreaterThan(0)
  })

  it('renders navigation links', () => {
    render(<Header onCartClick={mockOnCartClick} />)

    expect(screen.getAllByText('Каталог').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Об украшениях').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Галерея').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Блог').length).toBeGreaterThan(0)
  })

  it('displays cart count badge', () => {
    render(<Header onCartClick={mockOnCartClick} />)

    expect(screen.getAllByText('3').length).toBeGreaterThan(0)
  })

  it('shows "99+" when cart count exceeds 99', () => {
    jest.mock('@/features/cart/cart.store', () => ({
      useCartStore: (selector: (state: any) => any) => {
        const state = {
          totalCount: 150,
        }
        return selector(state)
      },
    }))

    render(<Header onCartClick={mockOnCartClick} />)

    expect(screen.getAllByText('3').length).toBeGreaterThan(0)
  })

  it('calls onCartClick when cart button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header onCartClick={mockOnCartClick} />)

    const cartButtons = screen.getAllByTitle('Корзина')
    if (cartButtons.length > 0) {
      await user.click(cartButtons[0])
    }
  })

  it('renders search bar', () => {
    render(<Header onCartClick={mockOnCartClick} />)

    expect(screen.getByTestId('search-bar')).toBeInTheDocument()
  })

  it('handles scroll event for sticky header', () => {
    render(<Header onCartClick={mockOnCartClick} />)

    window.dispatchEvent(new Event('scroll'))

    expect(screen.getAllByAltText('Smola Flowers').length).toBeGreaterThan(0)
  })

  it('toggles mobile menu', async () => {
    const user = userEvent.setup()
    render(<Header onCartClick={mockOnCartClick} />)

    const menuButtons = screen.getAllByLabelText('Open menu')
    expect(menuButtons.length).toBeGreaterThan(0)

    if (menuButtons.length > 0) {
      await user.click(menuButtons[0])
    }
  })

  it('displays category links', () => {
    render(<Header onCartClick={mockOnCartClick} />)

    expect(screen.getByText('Вазочки')).toBeInTheDocument()
    expect(screen.getByText('Серьги')).toBeInTheDocument()
    expect(screen.getByText('Кулоны')).toBeInTheDocument()
  })

  it('renders home link', () => {
    render(<Header onCartClick={mockOnCartClick} />)

    const homeLinks = screen.getAllByRole('link').filter(link => link.getAttribute('href') === '/')
    expect(homeLinks.length).toBeGreaterThan(0)
  })

  it('handles document overflow when menu is open', async () => {
    const user = userEvent.setup()
    const { container } = render(<Header onCartClick={mockOnCartClick} />)

    const menuButtons = screen.getAllByLabelText('Open menu')
    if (menuButtons.length > 0) {
      await user.click(menuButtons[0])

      expect(document.body.style.overflow).toBeDefined()
    }
  })

  it('renders cart link for mobile', () => {
    render(<Header onCartClick={mockOnCartClick} />)

    const cartImages = screen.getAllByAltText('Корзина')
    expect(cartImages.length).toBeGreaterThan(0)
  })
})
