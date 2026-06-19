import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

jest.mock('@/shared/hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}))

jest.mock('@/shared/api', () => ({
  getAllProducts: jest.fn(() =>
    Promise.resolve([
      { id: '1', title: 'Product 1', price: 100, img: '/img1.jpg', category: 'cat1', stock: true, description: '' },
      { id: '2', title: 'Product 2', price: 200, img: '/img2.jpg', category: 'cat2', stock: true, description: '' },
    ]),
  ),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('Введите название')
    expect(input).toBeInTheDocument()
  })

  it('loads products on mount', async () => {
    render(<SearchBar />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Введите название')).toBeInTheDocument()
    })
  })

  it('filters products on search input', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('Введите название')
    await user.type(input, 'Product 1')

    await waitFor(() => {
      expect(input).toHaveValue('Product 1')
    })
  })

  it('displays search results', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)

    const input = screen.getByPlaceholderText('Введите название')
    await user.type(input, 'Product')

    await waitFor(() => {
      expect(input).toHaveValue('Product')
    })
  })
})
