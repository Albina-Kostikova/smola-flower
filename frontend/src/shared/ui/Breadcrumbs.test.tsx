import { render, screen } from '@testing-library/react'
import { Breadcrumbs } from './Breadcrumbs'

jest.mock('@/shared/hooks', () => ({
  useBreadcrumbs: () => [
    { label: 'Home', href: '/' },
    { label: 'Category', href: '/category' },
  ],
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Breadcrumbs', () => {
  it('renders breadcrumb items from useBreadcrumbs hook', () => {
    render(<Breadcrumbs />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
  })

  it('renders custom items when provided', () => {
    const customItems = [
      { label: 'Custom 1', href: '/custom1' },
      { label: 'Custom 2', href: '/custom2' },
    ]

    render(<Breadcrumbs items={customItems} />)

    expect(screen.getByText('Custom 1')).toBeInTheDocument()
    expect(screen.getByText('Custom 2')).toBeInTheDocument()
  })

  it('renders separators between items', () => {
    render(<Breadcrumbs />)

    const separators = screen.getAllByText('/')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('makes last item non-clickable', () => {
    render(<Breadcrumbs />)

    const lastItem = screen.getByText('Category')
    expect(lastItem.closest('a')).toBeNull()
  })

  it('makes non-last items clickable', () => {
    render(<Breadcrumbs />)

    const firstItem = screen.getByText('Home')
    expect(firstItem.closest('a')).toBeInTheDocument()
  })
})
