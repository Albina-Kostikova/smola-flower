import { render, screen } from '@testing-library/react'
import { ItemCard } from './ItemCard'
import type { Item } from './types'

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

const mockItem: Item = {
  title: 'Gallery Item',
  src: '/gallery-item',
  img: '/gallery-item.jpg',
}

describe('ItemCard', () => {
  it('renders item with link', () => {
    render(<ItemCard item={mockItem} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/gallery-item')
  })

  it('renders item title', () => {
    render(<ItemCard item={mockItem} />)

    expect(screen.getByText('Gallery Item')).toBeInTheDocument()
  })

  it('renders item image', () => {
    render(<ItemCard item={mockItem} />)

    const image = screen.getByAltText('Gallery Item')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/gallery-item.jpg')
  })

  it('applies correct styles to link', () => {
    const { container } = render(<ItemCard item={mockItem} />)
    const link = container.querySelector('a')
    expect(link).toHaveAttribute('href', '/gallery-item')
  })

  it('renders title with correct styling', () => {
    const { container } = render(<ItemCard item={mockItem} />)

    const title = container.querySelector('h3')
    expect(title).toHaveClass('absolute', 'bottom-4', 'tall', 'uppercase')
  })
})
